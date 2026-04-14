import mongoose from "mongoose"

export type UserRole = "user" | "restaurant" | "admin"

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String },
    role: { type: String, enum: ["user", "restaurant", "admin"], default: "user" },
    googleId: { type: String, index: true, sparse: true },
    donationCount: { type: Number, default: 0 },
    totalDonated: { type: Number, default: 0 },
    mealsShared: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
  },
  { timestamps: true },
)

export const User = mongoose.model("User", userSchema)
