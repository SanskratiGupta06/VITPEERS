import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    emailVerified: { type: Boolean, default: false },
    password: { type: String, required: true },
    campus: {
      type: String,
      required: true,
      enum: ["Bhopal", "Vellore", "Chennai", "Amravati"],
    },
    branch: { type: String, required: true, trim: true },
    programmeLevel: { type: String, trim: true, default: "" },
    programme: { type: String, trim: true, default: "" },
    batch: { type: String, trim: true, default: "" },
    year: {
      type: String,
      required: true,
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Alumni"],
    },
    specialization: { type: String, trim: true, default: "" },
    bio: { type: String, trim: true, default: "", maxlength: 300 },
    skills: { type: [String], default: [] },
    linkedin: { type: String, trim: true, default: "" },
    github: { type: String, trim: true, default: "" },
    profilePic: { type: String, default: "" },
    phone: { type: String, trim: true, default: "" },
    instagram: { type: String, trim: true, default: "" },
    telegram: { type: String, trim: true, default: "" },
    interests: { type: [String], default: [] },
    themePreference: {
      type: String,
      enum: ["minimal", "spider", "f1", "cyber"],
      default: "minimal",
    },
    clubs: {
      type: [
        {
          clubName: { type: String, trim: true, required: true },
          team: { type: String, trim: true, default: "" },
          position: { type: String, trim: true, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
