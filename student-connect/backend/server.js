import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import connectionRoutes from "./routes/connections.js";
import notificationRoutes from "./routes/notifications.js";
import phoneRequestRoutes from "./routes/phoneRequests.js";
import messageRoutes from "./routes/messages.js";
import callRoutes from "./routes/calls.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json({ limit: "5mb" }));

app.get("/", (req, res) => {
  res.json({ message: "VITPEERS API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/phone-requests", phoneRequestRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/calls", callRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });
