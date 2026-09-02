import express from "express";
import mongoose from "mongoose";
import Message from "../models/Message.js";
import Connection from "../models/Connection.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// List of all conversations (one entry per person I've messaged/received from),
// with the last message and unread count
router.get("/conversations", auth, async (req, res) => {
  const myId = new mongoose.Types.ObjectId(req.userId);

  const conversations = await Message.aggregate([
    { $match: { $or: [{ sender: myId }, { recipient: myId }] } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: [{ $eq: ["$sender", myId] }, "$recipient", "$sender"],
        },
        lastMessage: { $first: "$content" },
        lastMessageAt: { $first: "$createdAt" },
        unreadCount: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ["$recipient", myId] }, { $eq: ["$read", false] }] },
              1,
              0,
            ],
          },
        },
      },
    },
    { $sort: { lastMessageAt: -1 } },
  ]);

  const populated = await Promise.all(
    conversations.map(async (c) => {
      const user = await mongoose
        .model("User")
        .findById(c._id)
        .select("name campus branch year profilePic");
      return { ...c, user };
    })
  );

  res.json(populated.filter((c) => c.user));
});

// Get the message thread with a specific user, and mark their messages as read
router.get("/thread/:userId", auth, async (req, res) => {
  const { userId } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: req.userId, recipient: userId },
      { sender: userId, recipient: req.userId },
    ],
  }).sort({ createdAt: 1 });

  await Message.updateMany(
    { sender: userId, recipient: req.userId, read: false },
    { read: true }
  );

  res.json(messages);
});

// Send a message — only allowed between accepted connections
router.post("/thread/:userId", auth, async (req, res) => {
  const { userId } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ message: "Message cannot be empty" });
  }

  const connection = await Connection.findOne({
    status: "accepted",
    $or: [
      { requester: req.userId, recipient: userId },
      { requester: userId, recipient: req.userId },
    ],
  });
  if (!connection) {
    return res.status(403).json({ message: "You can only message accepted connections" });
  }

  const message = await Message.create({
    sender: req.userId,
    recipient: userId,
    content: content.trim(),
  });

  res.status(201).json(message);
});

// Total unread message count (for navbar badge)
router.get("/unread-count", auth, async (req, res) => {
  const count = await Message.countDocuments({ recipient: req.userId, read: false });
  res.json({ count });
});

export default router;
