import { Router } from "express"
import mongoose from "mongoose"
import { Donation } from "../../models/Donation.js"
import { Reward } from "../../models/Reward.js"
import { User } from "../../models/User.js"
import { RESTAURANTS } from "../../data/restaurants.js"

const router = Router()

function getRandomReward() {
  const bucket = Math.random()
  if (bucket < 0.5) {
    const pts = Math.floor(Math.random() * 100) + 20
    return {
      type: "points" as const,
      title: `Bonus ${pts} Points`,
      description: "Use points to unlock future perks",
      value: String(pts),
      rarity: "common" as const,
    }
  }
  if (bucket < 0.8) {
    const discount = [5, 10, 15][Math.floor(Math.random() * 3)]
    return {
      type: "discount" as const,
      title: `${discount}% Discount Coupon`,
      description: "Applicable at partner restaurants",
      value: `${discount}% OFF`,
      rarity: "rare" as const,
    }
  }
  const badge = ["Bronze Donor", "Silver Donor", "Gold Giver"][Math.floor(Math.random() * 3)]
  return {
    type: "badge" as const,
    title: "Badge Unlocked",
    description: "Special recognition for your contribution",
    value: badge,
    rarity: "epic" as const,
  }
}

router.get("/", async (req, res) => {
  const userId = req.query.userId?.toString()
  if (!userId) return res.status(400).json({ message: "userId is required" })

  const donations = await Donation.find({ userId }).sort({ createdAt: -1 })
  return res.json({
    donations: donations.map((d) => ({
      id: d._id,
      restaurantName: d.restaurantName,
      restaurantAddress: d.restaurantAddress,
      amount: d.amount,
      tokens: d.tokens,
      scratchCards: d.scratchCards,
      isAnonymous: d.isAnonymous,
      message: d.message,
      timestamp: d.createdAt,
      status: d.status,
    })),
  })
})

router.post("/", async (req, res) => {
  try {
    const { userId, restaurantId, amount, isAnonymous, message, paymentMethod } = req.body as {
      userId?: string
      restaurantId?: string
      amount?: number
      isAnonymous?: boolean
      message?: string
      paymentMethod?: "card" | "upi" | "wallet"
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Valid userId is required" })
    }
    if (!restaurantId || !amount || amount < 5) {
      return res.status(400).json({ message: "restaurantId and minimum amount 5 are required" })
    }

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: "User not found" })

    const restaurant = RESTAURANTS.find((r) => r.id === restaurantId)
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" })

    const tokens = Math.floor(amount / 5)
    const scratchCards = Math.floor(amount / 10)
    const mealsShared = Math.floor(amount / 5)

    const donation = await Donation.create({
      userId,
      restaurantId,
      restaurantName: restaurant.name,
      restaurantAddress: restaurant.address,
      amount,
      tokens,
      scratchCards,
      isAnonymous: Boolean(isAnonymous),
      message: message || "",
      paymentMethod: paymentMethod || "card",
      status: "completed",
    })

    user.donationCount += 1
    user.totalDonated += amount
    user.mealsShared += mealsShared
    user.points += tokens
    await user.save()

    const generatedRewards = []
    for (let i = 0; i < scratchCards; i += 1) {
      const reward = await Reward.create({
        userId,
        ...getRandomReward(),
      })
      generatedRewards.push(reward)
    }

    return res.status(201).json({
      donation: {
        id: donation._id,
        amount: donation.amount,
        tokens: donation.tokens,
        scratchCards: donation.scratchCards,
        restaurantName: donation.restaurantName,
      },
      rewards: generatedRewards,
    })
  } catch (error) {
    console.error("create donation failed", error)
    return res.status(500).json({ message: "Donation failed" })
  }
})

export default router
