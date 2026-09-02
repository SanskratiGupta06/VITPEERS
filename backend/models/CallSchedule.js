import mongoose from "mongoose";

const callScheduleSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    proposedTime: { type: Date, required: true },
    note: { type: String, trim: true, maxlength: 200, default: "" },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    roomId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("CallSchedule", callScheduleSchema);
