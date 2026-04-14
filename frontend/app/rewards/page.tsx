"use client"

import { useEffect, useState } from "react"
import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { ScratchCardCollection } from "@/components/gamification/scratch-card-collection"
import { Card } from "@/components/ui/card"
import { Trophy, Zap, Gift, Target } from "lucide-react"
import { apiRequest } from "@/lib/api-client"
import { getSessionUser } from "@/lib/auth-session"

export default function RewardsPage() {
  const [scratchCards, setScratchCards] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])

  useEffect(() => {
    const user = getSessionUser()
    if (!user) return
    apiRequest<{ rewards: any[] }>(`/rewards?userId=${user.id}`)
      .then((data) =>
        setScratchCards(
          data.rewards.map((r) => ({
            id: r._id,
            reward: {
              type: r.type === "points" ? "tokens" : r.type,
              value: r.value,
              title: r.title,
              description: r.description,
              rarity: r.rarity,
            },
            isRevealed: r.isRevealed,
            earnedDate: r.unlockedAt,
          })),
        ),
      )
      .catch(console.error)
    apiRequest<{ leaderboard: any[] }>("/community/leaderboard")
      .then((data) => setLeaderboard(data.leaderboard))
      .catch(console.error)
  }, [])

  const handleCardReveal = (cardId: string, reward: any) => {
    setScratchCards((prev) => prev.map((card) => (card.id === cardId ? { ...card, isRevealed: true } : card)))
    apiRequest(`/rewards/${cardId}/reveal`, { method: "PATCH" }).catch(console.error)
  }

  return (
    <main className="min-h-screen bg-background">
      <GlassmorphismNav />

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">Rewards & Achievements</h1>
            <p className="text-xl text-white/70 text-pretty">
              Track your impact, collect rewards, and climb the leaderboard
            </p>
          </div>

          {/* Stats overview */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="glassmorphism border-white/20 p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">2nd</div>
              <div className="text-sm text-white/70">Leaderboard Rank</div>
            </Card>

            <Card className="glassmorphism border-white/20 p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">2</div>
              <div className="text-sm text-white/70">Badges Earned</div>
            </Card>

            <Card className="glassmorphism border-white/20 p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{scratchCards.filter((c) => !c.isRevealed).length}</div>
              <div className="text-sm text-white/70">Scratch Cards</div>
            </Card>

            <Card className="glassmorphism border-white/20 p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">185</div>
              <div className="text-sm text-white/70">Total Tokens</div>
            </Card>
          </div>

          <div className="mt-6 space-y-6">
            <ScratchCardCollection cards={scratchCards} onCardReveal={handleCardReveal} />
            <Card className="glassmorphism border-white/20 p-6">
              <h2 className="text-xl text-white font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Leaderboard
              </h2>
              <div className="space-y-2">
                {leaderboard.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between text-white bg-white/5 rounded p-2">
                    <span>
                      #{entry.rank} {entry.name}
                    </span>
                    <span>
                      {entry.mealsShared} meals | {entry.badge}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
