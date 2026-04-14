import mongoose from "mongoose"

const donationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    restaurantId: { type: String, required: true },
    restaurantName: { type: String, required: true },
    restaurantAddress: { type: String, required: true },
    amount: { type: Number, required: true, min: 5 },
    tokens: { type: Number, required: true, min: 0 },
    scratchCards: { type: Number, required: true, min: 0 },
    isAnonymous: { type: Boolean, default: false },
    message: { type: String, default: "" },
    paymentMethod: { type: String, enum: ["card", "upi", "wallet"], default: "card" },
    status: { type: String, enum: ["completed", "pending", "failed"], default: "completed" },
  },
  { timestamps: true },
)

export const Donation = mongoose.model("Donation", donationSchema)
