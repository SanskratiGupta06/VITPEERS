import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "connection_request",
        "connection_accepted",
        "phone_request",
        "phone_approved",
        "call_scheduled",
        "call_responded",
        "new_message",
      ],
      required: true,
    },
    connection: { type: mongoose.Schema.Types.ObjectId, ref: "Connection" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
