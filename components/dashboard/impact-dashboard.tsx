"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, MapPin, TrendingUp, Clock, Globe } from "lucide-react"

interface ImpactStats {
  totalMealsShared: number
  totalDonations: number
  activeContributors: number
  partnerRestaurants: number
  recentActivity: Array<{
    id: string
    type: "donation" | "redemption" | "new_user" | "new_restaurant"
    message: string
    timestamp: string
    amount?: number
  }>
  globalImpact: {
    countriesReached: number
    citiesActive: number
    mealsThisWeek: number
    growthRate: number
  }
}

export function ImpactDashboard() {
  const [stats, setStats] = useState<ImpactStats>({
    totalMealsShared: 12847,
    totalDonations: 64235,
    activeContributors: 3421,
    partnerRestaurants: 156,
    recentActivity: [],
    globalImpact: {
      countriesReached: 12,
      citiesActive: 89,
      mealsThisWeek: 1247,
      growthRate: 23.5,
    },
  })

  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        totalMealsShared: prev.totalMealsShared + Math.floor(Math.random() * 3),
        totalDonations: prev.totalDonations + Math.floor(Math.random() * 50),
        activeContributors: prev.activeContributors + Math.floor(Math.random() * 2),
        recentActivity: [
          {
            id: `activity-${Date.now()}`,
            type: ["donation", "redemption", "new_user"][Math.floor(Math.random() * 3)] as any,
            message: [
              "Sarah donated $25 to Annapurna Restaurant",
              "Mike redeemed 5 tokens for lunch",
              "Alex joined the community",
            ][Math.floor(Math.random() * 3)],
            timestamp: new Date().toISOString(),
            amount: Math.floor(Math.random() * 50) + 5,
          },
          ...prev.recentActivity.slice(0, 9),
        ],
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Impact Dashboard</h1>
          <p className="text-white/70">Real-time community impact and global reach</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
          <span className="text-sm text-white/70">{isLive ? "Live" : "Offline"}</span>
        </div>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glassmorphism border-white/20 p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-2 shimmer">{formatNumber(stats.totalMealsShared)}</div>
          <div className="text-sm text-white/70">Meals Shared</div>
          <div className="text-xs text-green-400 mt-1 flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3" />+{Math.floor(Math.random() * 10) + 1} today
          </div>
        </Card>

        <Card className="glassmorphism border-white/20 p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{formatNumber(stats.activeContributors)}</div>
          <div className="text-sm text-white/70">Contributors</div>
          <div className="text-xs text-green-400 mt-1 flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3" />+{stats.globalImpact.growthRate}% this week
          </div>
        </Card>

        <Card className="glassmorphism border-white/20 p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{stats.partnerRestaurants}</div>
          <div className="text-sm text-white/70">Partner Restaurants</div>
          <div className="text-xs text-blue-400 mt-1">{stats.globalImpact.citiesActive} cities active</div>
        </Card>

        <Card className="glassmorphism border-white/20 p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">${formatNumber(stats.totalDonations)}</div>
          <div className="text-sm text-white/70">Total Donations</div>
          <div className="text-xs text-purple-400 mt-1">{stats.globalImpact.countriesReached} countries</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="glassmorphism border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Live Activity Feed
            </h3>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">Live</Badge>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.message}</p>
                  <p className="text-white/50 text-xs mt-1">{new Date(activity.timestamp).toLocaleTimeString()}</p>
                </div>
                {activity.amount && (
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">${activity.amount}</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Global Impact Map */}
        <Card className="glassmorphism border-white/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-secondary" />
            Global Reach
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Weekly Meals</span>
              <span className="text-2xl font-bold text-white">{formatNumber(stats.globalImpact.mealsThisWeek)}</span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm text-white/70 mb-1">
                  <span>North America</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-2 bg-white/20" />
              </div>

              <div>
                <div className="flex justify-between text-sm text-white/70 mb-1">
                  <span>Asia</span>
                  <span>30%</span>
                </div>
                <Progress value={30} className="h-2 bg-white/20" />
              </div>

              <div>
                <div className="flex justify-between text-sm text-white/70 mb-1">
                  <span>Europe</span>
                  <span>20%</span>
                </div>
                <Progress value={20} className="h-2 bg-white/20" />
              </div>

              <div>
                <div className="flex justify-between text-sm text-white/70 mb-1">
                  <span>Others</span>
                  <span>5%</span>
                </div>
                <Progress value={5} className="h-2 bg-white/20" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.globalImpact.countriesReached}</div>
                <div className="text-sm text-white/70">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{stats.globalImpact.citiesActive}</div>
                <div className="text-sm text-white/70">Active Cities</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
