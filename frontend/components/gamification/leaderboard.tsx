"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Crown, TrendingUp, Calendar } from "lucide-react"

interface LeaderboardEntry {
  id: string
  name: string
  avatar?: string
  totalDonations: number
  mealsShared: number
  tokensEarned: number
  badges: string[]
  rank: number
  isCurrentUser?: boolean
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  timeframe: "weekly" | "monthly" | "all-time"
  onTimeframeChange: (timeframe: "weekly" | "monthly" | "all-time") => void
}

export function Leaderboard({ entries, timeframe, onTimeframeChange }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <span className="text-white/70 font-bold">#{rank}</span>
    }
  }

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600"
      case 2:
        return "bg-gradient-to-r from-gray-400 to-gray-600"
      case 3:
        return "bg-gradient-to-r from-amber-500 to-amber-700"
      default:
        return "bg-white/20"
    }
  }

  return (
    <Card className="glassmorphism border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-white">Leaderboard</h2>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={timeframe === "weekly" ? "default" : "outline"}
            onClick={() => onTimeframeChange("weekly")}
            className={
              timeframe === "weekly"
                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                : "border-white/20 text-white hover:bg-white/10 bg-transparent"
            }
          >
            <Calendar className="w-4 h-4 mr-1" />
            Week
          </Button>
          <Button
            size="sm"
            variant={timeframe === "monthly" ? "default" : "outline"}
            onClick={() => onTimeframeChange("monthly")}
            className={
              timeframe === "monthly"
                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                : "border-white/20 text-white hover:bg-white/10 bg-transparent"
            }
          >
            Month
          </Button>
          <Button
            size="sm"
            variant={timeframe === "all-time" ? "default" : "outline"}
            onClick={() => onTimeframeChange("all-time")}
            className={
              timeframe === "all-time"
                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                : "border-white/20 text-white hover:bg-white/10 bg-transparent"
            }
          >
            All Time
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {entries.map((entry, index) => (
          <Card
            key={entry.id}
            className={`glassmorphism border-white/20 p-4 transition-all duration-300 ${
              entry.isCurrentUser ? "ring-2 ring-primary/50 bg-primary/10" : "hover:bg-white/10 hover:border-white/30"
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadgeColor(entry.rank)}`}
              >
                {getRankIcon(entry.rank)}
              </div>

              {/* Avatar */}
              <Avatar className="w-12 h-12 border-2 border-white/20">
                <AvatarImage src={entry.avatar || "/placeholder.svg"} alt={entry.name} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-semibold">
                  {entry.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* User info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{entry.name}</h3>
                  {entry.isCurrentUser && (
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">You</Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  <span>${entry.totalDonations} donated</span>
                  <span>{entry.mealsShared} meals</span>
                  <span>{entry.tokensEarned} tokens</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-1">
                {entry.badges.slice(0, 3).map((badge, badgeIndex) => (
                  <div
                    key={badgeIndex}
                    className="w-6 h-6 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center"
                    title={badge}
                  >
                    <Trophy className="w-3 h-3 text-white" />
                  </div>
                ))}
                {entry.badges.length > 3 && (
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">+{entry.badges.length - 3}</span>
                  </div>
                )}
              </div>

              {/* Trend indicator */}
              <div className="text-right">
                <TrendingUp className="w-4 h-4 text-green-400 mx-auto mb-1" />
                <span className="text-xs text-green-400">+{Math.floor(Math.random() * 20) + 1}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">No leaderboard data</h3>
          <p className="text-white/70 text-sm">Start donating to see rankings</p>
        </div>
      )}
    </Card>
  )
}
