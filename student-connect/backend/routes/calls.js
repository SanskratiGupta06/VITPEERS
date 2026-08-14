import express from "express";
import crypto from "crypto";
import CallSchedule from "../models/CallSchedule.js";
import Connection from "../models/Connection.js";
import Notification from "../models/Notification.js";
import auth from "../middleware/auth.js";

const router = express.Router();

async function requireConnection(userA, userB) {
  return Connection.findOne({
    status: "accepted",
    $or: [
      { requester: userA, recipient: userB },
      { requester: userB, recipient: userA },
    ],
  });
}

// Propose a scheduled call
router.post("/schedule/:recipientId", auth, async (req, res) => {
  const { recipientId } = req.params;
  const { proposedTime, note } = req.body;

  if (!proposedTime) {
    return res.status(400).json({ message: "Proposed time is required" });
  }

  const connection = await requireConnection(req.userId, recipientId);
  if (!connection) {
    return res.status(403).json({ message: "You can only schedule calls with accepted connections" });
  }

  const roomId = `vitpeers-${crypto.randomBytes(6).toString("hex")}`;

  const call = await CallSchedule.create({
    requester: req.userId,
    recipient: recipientId,
    proposedTime,
    note: note || "",
    roomId,
  });

  await Notification.create({
    recipient: recipientId,
    sender: req.userId,
    type: "call_scheduled",
  });

  res.status(201).json(call);
});

// Respond to a scheduled call proposal
router.put("/schedule/:callId", auth, async (req, res) => {
  const { status } = req.body; // "accepted" | "declined"
  if (!["accepted", "declined"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const call = await CallSchedule.findById(req.params.callId);
  if (!call) return res.status(404).json({ message: "Call not found" });
  if (call.recipient.toString() !== req.userId) {
    return res.status(403).json({ message: "Not authorized" });
  }

  call.status = status;
  await call.save();
  res.json(call);
});

// List my scheduled calls (upcoming + past)
router.get("/schedule", auth, async (req, res) => {
  const calls = await CallSchedule.find({
    $or: [{ requester: req.userId }, { recipient: req.userId }],
  })
    .populate("requester", "name profilePic")
    .populate("recipient", "name profilePic")
    .sort({ proposedTime: 1 });

  res.json(calls);
});

// Start an instant call room with a connection (no scheduling needed)
router.post("/instant/:recipientId", auth, async (req, res) => {
  const { recipientId } = req.params;

  const connection = await requireConnection(req.userId, recipientId);
  if (!connection) {
    return res.status(403).json({ message: "You can only call accepted connections" });
  }

  // Deterministic room name so both users land in the same Jitsi room
  const ids = [req.userId, recipientId].sort();
  const roomId = `vitpeers-${ids[0]}-${ids[1]}`;

  res.json({ roomId });
});

export default router;
