"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Gift, TrendingUp, Calendar, Target, Star } from "lucide-react"

interface UserStats {
  name: string
  avatar?: string
  totalDonated: number
  mealsShared: number
  tokensEarned: number
  tokensAvailable: number
  scratchCardsAvailable: number
  badgesEarned: number
  currentStreak: number
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
  const [stats, setStats] = useState<UserStats>({
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=80&width=80",
    totalDonated: 1850,
    mealsShared: 370,
    tokensEarned: 185,
    tokensAvailable: 23,
    scratchCardsAvailable: 2,
    badgesEarned: 4,
    currentStreak: 7,
    rank: 2,
    nextMilestone: {
      name: "Community Hero",
      progress: 23,
      target: 50,
      reward: "Epic Badge + 50 Bonus Tokens",
    },
    recentDonations: [
      {
        id: "1",
        restaurant: "Annapurna Restaurant",
        amount: 25,
        date: "2024-01-20",
        tokens: 5,
      },
      {
        id: "2",
        restaurant: "Sai Krishna Tiffins",
        amount: 15,
        date: "2024-01-19",
        tokens: 3,
      },
    ],
  })

  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "achievement",
      message: "You've earned the 'Generous Heart' badge!",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
    {
      id: "2",
      type: "milestone",
      message: "You're halfway to Community Hero status!",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: false,
    },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        tokensEarned: prev.tokensEarned + Math.floor(Math.random() * 2),
        mealsShared: prev.mealsShared + Math.floor(Math.random() * 2),
      }))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

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
              <span>Rank #{stats.rank}</span>
              <span>{stats.currentStreak} day streak</span>
              <Badge className="bg-primary/20 text-primary border-primary/30">Active Donor</Badge>
            </div>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
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
            {stats.recentDonations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{donation.restaurant}</h4>
                  <p className="text-sm text-white/70">{new Date(donation.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">${donation.amount}</div>
                  <div className="text-sm text-primary">+{donation.tokens} tokens</div>
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full mt-4 border-white/20 text-white hover:bg-white/10 bg-transparent">
            View All Donations
          </Button>
        </Card>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <Card className="glassmorphism border-white/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Recent Achievements
          </h3>

          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  notification.read ? "bg-white/5" : "bg-primary/10 border border-primary/30"
                }`}
              >
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-white text-sm">{notification.message}</p>
                  <p className="text-white/50 text-xs mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
                </div>
                {!notification.read && (
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">New</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
