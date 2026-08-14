import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import Connection from "../models/Connection.js";
import PhoneRequest from "../models/PhoneRequest.js";
import EmailChangeRequest from "../models/EmailChangeRequest.js";
import EmailVerification from "../models/EmailVerification.js";
import PasswordReset from "../models/PasswordReset.js";
import Notification from "../models/Notification.js";
import Message from "../models/Message.js";
import CallSchedule from "../models/CallSchedule.js";
import auth from "../middleware/auth.js";
import { isCollegeEmail } from "../utils/validators.js";
import { sendVerificationEmail } from "../utils/mailer.js";

const router = express.Router();

// Get my own profile
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

// Update my profile
router.put("/me", auth, async (req, res) => {
  const allowedFields = [
    "name",
    "campus",
    "branch",
    "year",
    "specialization",
    "programmeLevel",
    "programme",
    "batch",
    "bio",
    "skills",
    "linkedin",
    "github",
    "profilePic",
    "phone",
    "instagram",
    "telegram",
    "interests",
    "clubs",
  ];
  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  if (Array.isArray(updates.clubs)) {
    updates.clubs = updates.clubs
      .map((c) => ({
        clubName: String(c.clubName || "").trim().slice(0, 80),
        team: String(c.team || "").trim().slice(0, 80),
        position: String(c.position || "").trim().slice(0, 80),
      }))
      .filter((c) => c.clubName && c.position);
  }

  const user = await User.findByIdAndUpdate(req.userId, updates, {
    new: true,
  }).select("-password");
  res.json(user);
});

// Permanently delete the authenticated user's account and all user-linked data.
// Requires the current password so a stolen session alone cannot delete the account.
router.delete("/me", auth, async (req, res) => {
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ message: "Current password is required to permanently delete your account." });

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "Account not found." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Incorrect password. Your account was not deleted." });

    const userId = user._id;

    await Promise.all([
      Connection.deleteMany({ $or: [{ requester: userId }, { recipient: userId }] }),
      PhoneRequest.deleteMany({ $or: [{ requester: userId }, { recipient: userId }] }),
      Notification.deleteMany({ $or: [{ sender: userId }, { recipient: userId }] }),
      Message.deleteMany({ $or: [{ sender: userId }, { recipient: userId }] }),
      CallSchedule.deleteMany({ $or: [{ requester: userId }, { recipient: userId }] }),
      EmailChangeRequest.deleteMany({ userId }),
      EmailVerification.deleteMany({ userId }),
      PasswordReset.deleteMany({ email: user.email }),
      User.deleteOne({ _id: userId }),
    ]);

    res.json({ deleted: true, message: "Your VITPEERS account and associated data have been permanently deleted." });
  } catch (err) {
    console.error("Account deletion error:", err);
    res.status(500).json({ message: "Could not delete your account. Please try again." });
  }
});

// Step 1: request an email change — sends a verification code to the NEW email
router.post("/change-email/request", auth, async (req, res) => {
  const newEmail = String(req.body.newEmail || "").trim().toLowerCase();

  if (!isCollegeEmail(newEmail)) {
    return res.status(400).json({ message: "Please use an official VIT college email." });
  }

  const currentUser = await User.findById(req.userId);
  if (newEmail === currentUser.email) {
    return res.status(400).json({ message: "That's already your current email." });
  }

  const existing = await User.findOne({ email: newEmail });
  if (existing) {
    return res.status(400).json({ message: "That email is already in use by another account." });
  }

  const code = String(crypto.randomInt(100000, 1000000));
  const codeHash = await bcrypt.hash(code, 10);

  await EmailChangeRequest.deleteMany({ userId: req.userId });
  await EmailChangeRequest.create({
    userId: req.userId,
    newEmail,
    codeHash,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  console.log(`🔑 Email change code for ${newEmail}: ${code}`);

  try {
    await sendVerificationEmail({
      to: newEmail,
      subject: "Confirm your new VITPEERS email",
      heading: "You requested to change the email on your VITPEERS account.",
      code,
    });
  } catch (err) {
    console.error("Email change email error:", err);
    return res.status(500).json({ message: "Could not send the verification email. Check your backend email configuration." });
  }

  res.json({ message: "Verification code sent to your new email address." });
});

// Step 2: confirm the change with the code sent to the new email
router.post("/change-email/confirm", auth, async (req, res) => {
  const code = String(req.body.code || "").trim();
  const request = await EmailChangeRequest.findOne({ userId: req.userId });

  if (!request || request.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired verification code. Request a new one." });
  }
  if (request.attempts >= 5) {
    return res.status(429).json({ message: "Too many attempts. Request a new code." });
  }

  request.attempts += 1;
  const valid = await bcrypt.compare(code, request.codeHash);
  await request.save();

  if (!valid) return res.status(400).json({ message: "Invalid verification code." });

  const stillFree = await User.findOne({ email: request.newEmail });
  if (stillFree) {
    return res.status(400).json({ message: "That email was just taken by another account." });
  }

  const user = await User.findByIdAndUpdate(
    req.userId,
    { email: request.newEmail },
    { new: true }
  ).select("-password");

  await EmailChangeRequest.deleteMany({ userId: req.userId });
  res.json({ message: "Email updated successfully.", user });
});

// Discover/search students with filters
router.get("/discover", auth, async (req, res) => {
  const { campus, branch, year, search } = req.query;
  const query = { _id: { $ne: req.userId } };

  if (campus) query.campus = campus;
  if (branch) query.branch = new RegExp(branch, "i");
  if (year) query.year = year;
  if (search) {
    query.$or = [
      { name: new RegExp(search, "i") },
      { specialization: new RegExp(search, "i") },
      { skills: new RegExp(search, "i") },
    ];
  }

  const users = await User.find(query).select("-password -phone").limit(50);
  res.json(users);
});

// View a specific user's profile
router.get("/:id", auth, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").lean();
  if (!user) return res.status(404).json({ message: "User not found" });

  const connection = await Connection.findOne({
    $or: [
      { requester: req.userId, recipient: req.params.id },
      { requester: req.params.id, recipient: req.userId },
    ],
  });

  const phoneRequest = await PhoneRequest.findOne({
    requester: req.userId,
    recipient: req.params.id,
  });

  const isOwnProfile = req.params.id === req.userId;
  const phoneApproved = phoneRequest?.status === "approved";

  if (!isOwnProfile && !phoneApproved) {
    delete user.phone;
  }

  res.json({
    user,
    connectionStatus: connection?.status || null,
    connection,
    phoneRequestStatus: phoneRequest?.status || null,
  });
});

export default router;
