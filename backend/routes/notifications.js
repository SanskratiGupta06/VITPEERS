import express from "express";
import Notification from "../models/Notification.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all my notifications (most recent first)
router.get("/", auth, async (req, res) => {
  const notifications = await Notification.find({ recipient: req.userId })
    .populate("sender", "name campus branch year")
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(notifications);
});

// Get unread count (for the navbar badge)
router.get("/unread-count", auth, async (req, res) => {
  const count = await Notification.countDocuments({
    recipient: req.userId,
    read: false,
  });
  res.json({ count });
});

// Mark a single notification as read
router.put("/:id/read", auth, async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.userId },
    { read: true },
    { new: true }
  );
  if (!notification) return res.status(404).json({ message: "Notification not found" });
  res.json(notification);
});

// Mark all as read
router.put("/read-all", auth, async (req, res) => {
  await Notification.updateMany(
    { recipient: req.userId, read: false },
    { read: true }
  );
  res.json({ message: "All notifications marked as read" });
});

export default router;
