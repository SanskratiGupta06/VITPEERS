import express from "express";
import PhoneRequest from "../models/PhoneRequest.js";
import Notification from "../models/Notification.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Request to view someone's phone number
router.post("/request/:recipientId", auth, async (req, res) => {
  const { recipientId } = req.params;
  if (recipientId === req.userId) {
    return res.status(400).json({ message: "You can't request your own number" });
  }

  try {
    const existing = await PhoneRequest.findOne({
      requester: req.userId,
      recipient: recipientId,
    });
    if (existing) {
      return res.status(400).json({ message: "You already sent a request to this user" });
    }

    const request = await PhoneRequest.create({
      requester: req.userId,
      recipient: recipientId,
      status: "pending",
    });

    await Notification.create({
      recipient: recipientId,
      sender: req.userId,
      type: "phone_request",
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: "Could not send request" });
  }
});

// Approve or deny a phone number request (only the recipient can respond)
router.put("/:requestId", auth, async (req, res) => {
  const { status } = req.body; // "approved" | "denied"
  if (!["approved", "denied"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const request = await PhoneRequest.findById(req.params.requestId);
  if (!request) return res.status(404).json({ message: "Request not found" });
  if (request.recipient.toString() !== req.userId) {
    return res.status(403).json({ message: "Not authorized" });
  }

  request.status = status;
  await request.save();

  if (status === "approved") {
    await Notification.create({
      recipient: request.requester,
      sender: req.userId,
      type: "phone_approved",
    });
  }

  res.json(request);
});

// Get all phone requests I've received (pending ones to review)
router.get("/received", auth, async (req, res) => {
  const requests = await PhoneRequest.find({ recipient: req.userId })
    .populate("requester", "name campus branch year")
    .sort({ createdAt: -1 });
  res.json(requests);
});

// Check status of my request toward a specific user
router.get("/status/:userId", auth, async (req, res) => {
  const request = await PhoneRequest.findOne({
    requester: req.userId,
    recipient: req.params.userId,
  });
  res.json({ status: request?.status || null });
});

export default router;
