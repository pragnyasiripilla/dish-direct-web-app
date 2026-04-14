"use client"

import { useEffect, useState } from "react"
import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiRequest } from "@/lib/api-client"

interface Stats {
  mealsShared: number
  activeDonors: number
  restaurants: number
  rewardsUnlocked: number
}

interface Leader {
  id: string
  rank: number
  name: string
  donations: number
  mealsShared: number
  badge: string
}

export default function CommunityImpactPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [leaders, setLeaders] = useState<Leader[]>([])

  useEffect(() => {
    Promise.all([
      apiRequest<{ stats: Stats }>("/community/stats"),
      apiRequest<{ leaderboard: Leader[] }>("/community/leaderboard"),
    ])
      .then(([s, l]) => {
        setStats(s.stats)
        setLeaders(l.leaderboard)
      })
      .catch(console.error)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <GlassmorphismNav />
      <div className="pt-20 pb-8 container mx-auto px-4 space-y-6">
        <h1 className="text-4xl font-bold text-white">Community Impact</h1>

        <div className="grid md:grid-cols-4 gap-4">
          <Card className="glassmorphism border-white/20 p-4 text-white">Meals Shared: {stats?.mealsShared ?? 0}</Card>
          <Card className="glassmorphism border-white/20 p-4 text-white">Active Donors: {stats?.activeDonors ?? 0}</Card>
          <Card className="glassmorphism border-white/20 p-4 text-white">Restaurants: {stats?.restaurants ?? 0}</Card>
          <Card className="glassmorphism border-white/20 p-4 text-white">
            Rewards Unlocked: {stats?.rewardsUnlocked ?? 0}
          </Card>
        </div>

        <Card className="glassmorphism border-white/20 p-4">
          <h2 className="text-2xl text-white font-semibold mb-4">Global Leaderboard</h2>
          <div className="space-y-3">
            {leaders.map((leader) => (
              <div key={leader.id} className="flex items-center justify-between bg-white/5 rounded p-3 text-white">
                <div>
                  #{leader.rank} {leader.name}
                </div>
                <div className="flex items-center gap-4">
                  <span>Donations: {leader.donations}</span>
                  <span>Meals: {leader.mealsShared}</span>
                  <Badge>{leader.badge}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  )
}
