import express from "express";
import Connection from "../models/Connection.js";
import Notification from "../models/Notification.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Send a connection request
router.post("/request/:recipientId", auth, async (req, res) => {
  const { recipientId } = req.params;
  if (recipientId === req.userId) {
    return res.status(400).json({ message: "You can't connect with yourself" });
  }

  try {
    const existing = await Connection.findOne({
      $or: [
        { requester: req.userId, recipient: recipientId },
        { requester: recipientId, recipient: req.userId },
      ],
    });
    if (existing) {
      return res.status(400).json({ message: "A connection already exists with this user" });
    }

    const connection = await Connection.create({
      requester: req.userId,
      recipient: recipientId,
      status: "pending",
    });

    await Notification.create({
      recipient: recipientId,
      sender: req.userId,
      type: "connection_request",
      connection: connection._id,
    });

    res.status(201).json(connection);
  } catch (err) {
    res.status(500).json({ message: "Could not send request" });
  }
});

// Accept or reject a request
router.put("/:connectionId", auth, async (req, res) => {
  const { status } = req.body; // "accepted" | "rejected"
  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const connection = await Connection.findById(req.params.connectionId);
  if (!connection) return res.status(404).json({ message: "Request not found" });
  if (connection.recipient.toString() !== req.userId) {
    return res.status(403).json({ message: "Not authorized" });
  }

  connection.status = status;
  await connection.save();

  if (status === "accepted") {
    await Notification.create({
      recipient: connection.requester,
      sender: req.userId,
      type: "connection_accepted",
      connection: connection._id,
    });
  }

  res.json(connection);
});

// List my connections + pending requests
router.get("/", auth, async (req, res) => {
  const connections = await Connection.find({
    $or: [{ requester: req.userId }, { recipient: req.userId }],
  })
    .populate("requester", "name campus branch year")
    .populate("recipient", "name campus branch year");

  res.json(connections);
});

export default router;
