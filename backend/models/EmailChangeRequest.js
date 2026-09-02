import mongoose from "mongoose";

const emailChangeRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    newEmail: { type: String, required: true, lowercase: true, trim: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("EmailChangeRequest", emailChangeRequestSchema);
