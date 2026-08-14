import mongoose from "mongoose";

const phoneRequestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "denied"],
      default: "pending",
    },
  },
  { timestamps: true }
);

phoneRequestSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export default mongoose.model("PhoneRequest", phoneRequestSchema);
