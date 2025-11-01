"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Heart, Star, Zap, Crown, Gift, Target, Users } from "lucide-react"

interface BadgeData {
  id: string
  name: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  earned: boolean
  progress?: number
  maxProgress?: number
  earnedDate?: string
}

interface BadgeCollectionProps {
  badges: BadgeData[]
}

export function BadgeCollection({ badges }: BadgeCollectionProps) {
  const getBadgeIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      heart: <Heart className="w-6 h-6" />,
      star: <Star className="w-6 h-6" />,
      trophy: <Trophy className="w-6 h-6" />,
      zap: <Zap className="w-6 h-6" />,
      crown: <Crown className="w-6 h-6" />,
      gift: <Gift className="w-6 h-6" />,
      target: <Target className="w-6 h-6" />,
      users: <Users className="w-6 h-6" />,
    }
    return iconMap[iconName] || <Trophy className="w-6 h-6" />
  }

  const getRarityColor = (rarity: string, earned: boolean) => {
    const colors = {
      common: earned ? "from-gray-400 to-gray-600" : "from-gray-600 to-gray-800",
      rare: earned ? "from-blue-400 to-blue-600" : "from-blue-600 to-blue-800",
      epic: earned ? "from-purple-400 to-purple-600" : "from-purple-600 to-purple-800",
      legendary: earned ? "from-yellow-400 to-yellow-600" : "from-yellow-600 to-yellow-800",
    }
    return colors[rarity as keyof typeof colors] || colors.common
  }

  const earnedBadges = badges.filter((badge) => badge.earned)
  const unearnedBadges = badges.filter((badge) => !badge.earned)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Badge Collection</h2>
        <Badge className="bg-primary/20 text-primary border-primary/30">
          {earnedBadges.length}/{badges.length} earned
        </Badge>
      </div>

      {/* Earned badges */}
      {earnedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Earned Badges ({earnedBadges.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => (
              <Card
                key={badge.id}
                className="glassmorphism border-white/20 p-4 text-center hover:bg-white/20 transition-all duration-300 group"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${getRarityColor(
                    badge.rarity,
                    true,
                  )} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shimmer`}
                >
                  <div className="text-white">{getBadgeIcon(badge.icon)}</div>
                </div>
                <h4 className="font-semibold text-white text-sm mb-1">{badge.name}</h4>
                <p className="text-xs text-white/70 mb-2">{badge.description}</p>
                <Badge className={`bg-gradient-to-r ${getRarityColor(badge.rarity, true)} text-white border-0 text-xs`}>
                  {badge.rarity}
                </Badge>
                {badge.earnedDate && (
                  <p className="text-xs text-white/50 mt-2">Earned {new Date(badge.earnedDate).toLocaleDateString()}</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Progress badges */}
      {unearnedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-white/70" />
            In Progress ({unearnedBadges.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unearnedBadges.map((badge) => (
              <Card key={badge.id} className="glassmorphism border-white/20 p-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${getRarityColor(
                      badge.rarity,
                      false,
                    )} rounded-full flex items-center justify-center flex-shrink-0 opacity-50`}
                  >
                    <div className="text-white">{getBadgeIcon(badge.icon)}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{badge.name}</h4>
                      <Badge
                        className={`bg-gradient-to-r ${getRarityColor(badge.rarity, false)} text-white border-0 text-xs`}
                      >
                        {badge.rarity}
                      </Badge>
                    </div>
                    <p className="text-sm text-white/70 mb-3">{badge.description}</p>
                    {badge.progress !== undefined && badge.maxProgress && (
                      <div>
                        <div className="flex justify-between text-sm text-white/60 mb-1">
                          <span>Progress</span>
                          <span>
                            {badge.progress}/{badge.maxProgress}
                          </span>
                        </div>
                        <Progress value={(badge.progress / badge.maxProgress) * 100} className="h-2 bg-white/20" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
