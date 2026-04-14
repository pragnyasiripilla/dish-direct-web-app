import { Router } from "express"
import { Reward } from "../../models/Reward.js"

const router = Router()

router.get("/", async (req, res) => {
  const userId = req.query.userId?.toString()
  if (!userId) return res.status(400).json({ message: "userId is required" })
  const rewards = await Reward.find({ userId }).sort({ createdAt: -1 })
  return res.json({ rewards })
})

router.patch("/:id/reveal", async (req, res) => {
  const reward = await Reward.findByIdAndUpdate(req.params.id, { isRevealed: true }, { new: true })
  if (!reward) return res.status(404).json({ message: "Reward not found" })
  return res.json({ reward })
})

export default router
