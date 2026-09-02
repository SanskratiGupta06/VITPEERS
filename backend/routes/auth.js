import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import PasswordReset from "../models/PasswordReset.js";
import EmailVerification from "../models/EmailVerification.js";
import { isCollegeEmail } from "../utils/validators.js";
import { createMailer, sendVerificationEmail } from "../utils/mailer.js";

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

async function sendResetCode(email, code) {
  await sendVerificationEmail({
    to: email,
    subject: "VITPEERS password reset code",
    heading: "You requested to reset your VITPEERS password.",
    code,
  });
}

async function createAndSendEmailVerification(user) {
  const code = String(crypto.randomInt(100000, 1000000));
  const codeHash = await bcrypt.hash(code, 10);
  await EmailVerification.deleteMany({ userId: user._id });
  await EmailVerification.create({
    userId: user._id,
    email: user.email,
    codeHash,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  console.log(`🔐 Signup verification code for ${user.email}: ${code}`);
  await sendVerificationEmail({
    to: user.email,
    subject: "Verify your VITPEERS email",
    heading: "Welcome to VITPEERS. Verify your VIT college email to activate your account.",
    code,
  });
}

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, campus, branch, year, specialization, programmeLevel, programme } = req.body;
    if (!name || !email || !password || !campus || !branch || !year) {
      return res.status(400).json({ message: "Please fill in your name, VIT email, password, campus, programme and year." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }
    if (!isCollegeEmail(email)) {
      return res.status(400).json({ message: "Please use an official VIT college email (for example @vitbhopal.ac.in, @vitstudent.ac.in, @vitchennai.ac.in, @vitap.ac.in or @vit.ac.in)." });
    }

    const normalizedEmail = email.toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      if (existing.emailVerified === false) {
        try {
          await createAndSendEmailVerification(existing);
          return res.status(200).json({
            verificationRequired: true,
            email: existing.email,
            message: "This account is not verified yet. We sent a new verification code to your email.",
          });
        } catch (mailErr) {
          console.error("Verification resend error:", mailErr);
          return res.status(503).json({ message: "Your account exists but the verification email could not be sent. Please try again." });
        }
      }
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email: normalizedEmail, password: hashedPassword, campus, branch, year, specialization, programmeLevel, programme,
      emailVerified: false,
    });

    try {
      await createAndSendEmailVerification(user);
    } catch (mailErr) {
      console.error("Signup verification email error:", mailErr);
      return res.status(503).json({ message: "Account created, but we could not send the verification email. Please try signing up again or contact support." });
    }

    res.status(201).json({
      verificationRequired: true,
      email: user.email,
      message: "Verification code sent to your VIT email.",
    });
  } catch (err) {
    console.error("Signup error:", { name: err.name, code: err.code, message: err.message, errors: err.errors });
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0]?.message || "Invalid signup details.";
      return res.status(400).json({ message: firstError });
    }
    if (err.code === 11000) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

router.post("/verify-email", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const code = String(req.body.code || "").trim();

  if (!isCollegeEmail(email)) {
    return res.status(400).json({ message: "Please use your official VIT college email." });
  }

  try {
    const user = await User.findOne({ email });
    const request = await EmailVerification.findOne({ email }).sort({ createdAt: -1 });
    if (!user || user.emailVerified === true) {
      return res.status(400).json({ message: "This email is already verified or the account was not found." });
    }
    if (!request || request.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired verification code. Request a new code." });
    }
    if (request.attempts >= 5) {
      return res.status(429).json({ message: "Too many attempts. Request a new code." });
    }

    request.attempts += 1;
    const valid = await bcrypt.compare(code, request.codeHash);
    await request.save();
    if (!valid) return res.status(400).json({ message: "Invalid verification code." });

    user.emailVerified = true;
    await user.save();
    await EmailVerification.deleteMany({ userId: user._id });

    const token = signToken(user._id);
    const userSafe = user.toObject();
    delete userSafe.password;
    res.json({ verified: true, token, user: userSafe, message: "Email verified successfully. Welcome to VITPEERS!" });
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).json({ message: "Could not verify the email right now. Please try again." });
  }
});

router.post("/resend-verification", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!isCollegeEmail(email)) {
    return res.status(400).json({ message: "Please use your official VIT college email." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account found for this email." });
    if (user.emailVerified === true) return res.status(400).json({ message: "This email is already verified. You can log in." });
    await createAndSendEmailVerification(user);
    res.json({ message: "A new verification code has been sent to your email." });
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(503).json({ message: "Could not send a new verification email. Please check the email service and try again." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });
    if (user.emailVerified === false) {
      return res.status(403).json({ message: "Please verify your VIT email before logging in." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    const token = signToken(user._id);
    const userSafe = user.toObject();
    delete userSafe.password;
    res.json({ token, user: userSafe });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

router.get("/email-status", async (req, res) => {
  try {
    const transporter = createMailer();
    if (!transporter) return res.status(503).json({ configured: false, message: "SMTP email settings are missing in .env" });
    await transporter.verify();
    res.json({ configured: true, message: "SMTP connection is ready." });
  } catch (err) {
    console.error("SMTP verification error:", err.message);
    res.status(503).json({ configured: false, message: "SMTP is configured but the mail server rejected the connection. Check EMAIL_USER, EMAIL_PASS, EMAIL_PORT and EMAIL_SECURE." });
  }
});

router.post("/forgot-password", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!isCollegeEmail(email)) {
    return res.status(400).json({ message: "Please use your official VIT college email." });
  }

  const generic = { message: "If an account exists for that email, a verification code has been sent." };
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json(generic);

    const code = String(crypto.randomInt(100000, 1000000));
    const codeHash = await bcrypt.hash(code, 10);
    await PasswordReset.deleteMany({ email });
    await PasswordReset.create({
      email,
      codeHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Dev safety net: always log the code server-side so you can test the flow
    // even while diagnosing email deliverability separately. This is never
    // exposed to the browser/client — only visible in your own terminal.
    console.log(`🔑 Password reset code for ${email}: ${code}`);

    await sendResetCode(email, code);
    return res.json(generic);
  } catch (err) {
    console.error("Password reset email error:", err);
    return res.status(500).json({ message: "Password reset email service is not configured correctly." });
  }
});

router.post("/verify-reset-code", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const code = String(req.body.code || "").trim();
  const reset = await PasswordReset.findOne({ email });

  if (!reset || reset.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired verification code." });
  }
  if (reset.attempts >= 5) {
    return res.status(429).json({ message: "Too many attempts. Request a new code." });
  }

  reset.attempts += 1;
  const valid = await bcrypt.compare(code, reset.codeHash);
  await reset.save();

  if (!valid) return res.status(400).json({ message: "Invalid or expired verification code." });
  res.json({ verified: true });
});

router.post("/reset-password", async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const code = String(req.body.code || "").trim();
  const password = String(req.body.password || "");

  if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters." });

  const reset = await PasswordReset.findOne({ email });
  if (!reset || reset.expiresAt < new Date()) {
    return res.status(400).json({ message: "Verification has expired. Request a new code." });
  }

  const valid = await bcrypt.compare(code, reset.codeHash);
  if (!valid) return res.status(400).json({ message: "Invalid verification code." });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Unable to reset this account." });

  user.password = await bcrypt.hash(password, 10);
  await user.save();
  await PasswordReset.deleteMany({ email });

  res.json({ message: "Password updated successfully." });
});

export default router;
