import { Router } from "express"
import { Donation } from "../../models/Donation.js"
import { User } from "../../models/User.js"
import { Reward } from "../../models/Reward.js"

const router = Router()

function badgeFor(donationCount: number, mealsShared: number) {
  const score = donationCount + mealsShared / 10
  if (score >= 80) return "Gold"
  if (score >= 30) return "Silver"
  return "Bronze"
}

router.get("/leaderboard", async (_req, res) => {
  const users = await User.find({}).sort({ mealsShared: -1, donationCount: -1 }).limit(20)
  const leaderboard = users.map((u, index) => ({
    id: u._id,
    rank: index + 1,
    name: u.name,
    donations: u.donationCount,
    mealsShared: u.mealsShared,
    badge: badgeFor(u.donationCount, u.mealsShared),
  }))
  return res.json({ leaderboard })
})

router.get("/stats", async (_req, res) => {
  const [totalDonations, totalRewards, totalRestaurants, users] = await Promise.all([
    Donation.countDocuments({}),
    Reward.countDocuments({}),
    Promise.resolve(4),
    User.countDocuments({}),
  ])
  const mealAggregation = await User.aggregate([{ $group: { _id: null, total: { $sum: "$mealsShared" } } }])
  return res.json({
    stats: {
      mealsShared: mealAggregation[0]?.total || 0,
      activeDonors: users,
      restaurants: totalRestaurants,
      rewardsUnlocked: totalRewards,
      donationCount: totalDonations,
    },
  })
})

export default router
