import mongoose from "mongoose"

const rewardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["discount", "points", "badge"], required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    value: { type: String, required: true },
    rarity: { type: String, enum: ["common", "rare", "epic", "legendary"], default: "common" },
    unlockedAt: { type: Date, default: Date.now },
    isRevealed: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const Reward = mongoose.model("Reward", rewardSchema)
