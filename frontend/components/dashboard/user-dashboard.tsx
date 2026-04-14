"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ClientDateText } from "@/components/ui/client-date-text"
import { Heart, Gift, TrendingUp, Calendar, Target, Star } from "lucide-react"
import { API_BASE, apiRequest } from "@/lib/api-client"
import { getSessionToken } from "@/lib/auth-session"

interface UserStats {
  name: string
  avatar?: string
  donationCount: number
  totalDonated: number
  mealsShared: number
  tokensEarned: number
  tokensAvailable: number
  scratchCardsAvailable: number
  badgesEarned: number
  rank: number
  nextMilestone: {
    name: string
    progress: number
    target: number
    reward: string
  }
  recentDonations: Array<{
    id: string
    restaurant: string
    amount: number
    date: string
    tokens: number
  }>
}

export function UserDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        setIsLoading(true)
        const token = getSessionToken()
        if (!token) {
          setError("Please sign in to view dashboard")
          setIsLoading(false)
          return
        }

        const meRes = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!meRes.ok) {
          setError("Unable to load user profile")
          setIsLoading(false)
          return
        }
        const meData = (await meRes.json()) as {
          user: {
            id: string
            name: string
            donationCount: number
            totalDonated: number
            mealsShared: number
            points: number
            badges: string[]
          }
        }

        const [donationData, rewardData, leaderboardData] = await Promise.all([
          apiRequest<{ donations: Array<{ id: string; restaurantName: string; amount: number; tokens: number; timestamp: string }> }>(
            `/donations?userId=${meData.user.id}`,
          ),
          apiRequest<{ rewards: Array<{ isRevealed: boolean }> }>(`/rewards?userId=${meData.user.id}`),
          apiRequest<{ leaderboard: Array<{ id: string; rank: number }> }>("/community/leaderboard"),
        ])

        const nextTarget = 50
        const progress = Math.min(meData.user.mealsShared, nextTarget)
        const leaderboardEntry = leaderboardData.leaderboard.find((entry) => String(entry.id) === String(meData.user.id))

        setStats({
          name: meData.user.name,
          donationCount: meData.user.donationCount,
          totalDonated: meData.user.totalDonated,
          mealsShared: meData.user.mealsShared,
          tokensEarned: meData.user.points,
          tokensAvailable: meData.user.points,
          scratchCardsAvailable: rewardData.rewards.filter((r) => !r.isRevealed).length,
          badgesEarned: meData.user.badges.length,
          rank: leaderboardEntry?.rank || 0,
          nextMilestone: {
            name: "Community Hero",
            progress,
            target: nextTarget,
            reward: "Epic Badge + 50 Bonus Tokens",
          },
          recentDonations: donationData.donations.slice(0, 5).map((donation) => ({
            id: donation.id,
            restaurant: donation.restaurantName,
            amount: donation.amount,
            date: donation.timestamp,
            tokens: donation.tokens,
          })),
        })
      } catch {
        setError("Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (isLoading) {
    return (
      <Card className="glassmorphism border-white/20 p-8 text-center">
        <p className="text-white/70">Loading...</p>
      </Card>
    )
  }

  if (error || !stats) {
    return (
      <Card className="glassmorphism border-white/20 p-8 text-center">
        <p className="text-red-400">{error || "No data available"}</p>
      </Card>
    )
  }

  const progressPercentage = (stats.nextMilestone.progress / stats.nextMilestone.target) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-primary">
            <AvatarImage src={stats.avatar || "/placeholder.svg"} alt={stats.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xl font-bold">
              {stats.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-white">{stats.name}</h1>
            <div className="flex items-center gap-4 text-sm text-white/70">
              <span>{stats.rank ? `Rank #${stats.rank}` : "Unranked"}</span>
              <span>{stats.donationCount} donations</span>
              <Badge className="bg-primary/20 text-primary border-primary/30">Active Donor</Badge>
            </div>
          </div>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => {
            console.log("[ui] Donate Now clicked")
            router.push("/donate")
          }}
        >
          <Heart className="w-4 h-4 mr-2" />
          Donate Now
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glassmorphism border-white/20 p-4 text-center">
          <div className="text-2xl font-bold text-white mb-1">${stats.totalDonated}</div>
          <div className="text-sm text-white/70">Total Donated</div>
          <div className="text-xs text-green-400 mt-1 flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +12% this month
          </div>
        </Card>

        <Card className="glassmorphism border-white/20 p-4 text-center">
          <div className="text-2xl font-bold text-white mb-1">{stats.mealsShared}</div>
          <div className="text-sm text-white/70">Meals Shared</div>
          <div className="text-xs text-blue-400 mt-1">Impact Score: {Math.floor(stats.mealsShared / 10)}</div>
        </Card>

        <Card className="glassmorphism border-white/20 p-4 text-center">
          <div className="text-2xl font-bold text-white mb-1">{stats.tokensAvailable}</div>
          <div className="text-sm text-white/70">Available Tokens</div>
          <div className="text-xs text-primary mt-1">{stats.tokensEarned} total earned</div>
        </Card>

        <Card className="glassmorphism border-white/20 p-4 text-center">
          <div className="text-2xl font-bold text-white mb-1">{stats.scratchCardsAvailable}</div>
          <div className="text-sm text-white/70">Scratch Cards</div>
          <div className="text-xs text-secondary mt-1">Ready to reveal</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Progress to next milestone */}
        <Card className="glassmorphism border-white/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Next Milestone
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-white">{stats.nextMilestone.name}</h4>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Epic</Badge>
            </div>

            <div>
              <div className="flex justify-between text-sm text-white/70 mb-2">
                <span>Progress</span>
                <span>
                  {stats.nextMilestone.progress}/{stats.nextMilestone.target}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3 bg-white/20" />
            </div>

            <div className="bg-gradient-to-r from-purple-500/20 to-primary/20 rounded-lg p-4 border border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-white">Reward</span>
              </div>
              <p className="text-sm text-white/80">{stats.nextMilestone.reward}</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-white/70">
                {stats.nextMilestone.target - stats.nextMilestone.progress} more meals to unlock
              </p>
            </div>
          </div>
        </Card>

        {/* Recent activity */}
        <Card className="glassmorphism border-white/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-secondary" />
            Recent Donations
          </h3>

          <div className="space-y-3">
            {stats.recentDonations.length > 0 ? (
              stats.recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <h4 className="text-white font-medium">{donation.restaurant}</h4>
                    <p className="text-sm text-white/70">
                      <ClientDateText value={donation.date} mode="date" />
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">${donation.amount}</div>
                    <div className="text-sm text-primary">+{donation.tokens} tokens</div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/60 text-sm">No donations yet.</p>
            )}
          </div>

          <Button
            variant="outline"
            className="w-full mt-4 border-white/20 text-white hover:bg-white/10 bg-transparent"
            onClick={() => {
              console.log("[ui] View All Donations clicked")
              router.push("/donate")
            }}
          >
            View All Donations
          </Button>
        </Card>
      </div>

      <Card className="glassmorphism border-white/20 p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Achievements
        </h3>
        <p className="text-white/70 text-sm">
          You have earned <span className="text-white font-semibold">{stats.badgesEarned}</span> badges so far.
        </p>
      </Card>
    </div>
  )
}
