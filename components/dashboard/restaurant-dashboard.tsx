"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Store, DollarSign, Users, TrendingUp, Clock, MapPin, Star, Heart } from "lucide-react"

interface RestaurantStats {
  name: string
  address: string
  verified: boolean
  totalReceived: number
  mealsProvided: number
  activeTokens: number
  redeemedTokens: number
  rating: number
  reviewCount: number
  recentDonations: Array<{
    id: string
    donor: string
    amount: number
    tokens: number
    date: string
    isAnonymous: boolean
  }>
  monthlyTrend: Array<{
    month: string
    donations: number
    redemptions: number
  }>
}

export function RestaurantDashboard() {
  const [stats, setStats] = useState<RestaurantStats>({
    name: "Annapurna Restaurant",
    address: "Main Road, Vizianagaram",
    verified: true,
    totalReceived: 12450,
    mealsProvided: 2490,
    activeTokens: 156,
    redeemedTokens: 2334,
    rating: 4.2,
    reviewCount: 89,
    recentDonations: [
      {
        id: "1",
        donor: "Sarah J.",
        amount: 25,
        tokens: 5,
        date: "2024-01-20",
        isAnonymous: false,
      },
      {
        id: "2",
        donor: "Anonymous",
        amount: 50,
        tokens: 10,
        date: "2024-01-20",
        isAnonymous: true,
      },
    ],
    monthlyTrend: [
      { month: "Dec", donations: 1200, redemptions: 240 },
      { month: "Jan", donations: 1450, redemptions: 290 },
    ],
  })

  const [pendingRedemptions, setPendingRedemptions] = useState([
    {
      id: "1",
      user: "Mike Chen",
      tokens: 5,
      requestedMeal: "Vegetarian Thali",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: "2",
      user: "Anonymous User",
      tokens: 3,
      requestedMeal: "Dosa Set",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        totalReceived: prev.totalReceived + Math.floor(Math.random() * 25),
        activeTokens: prev.activeTokens + Math.floor(Math.random() * 3),
      }))
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const handleRedemption = (redemptionId: string, approved: boolean) => {
    setPendingRedemptions((prev) => prev.filter((r) => r.id !== redemptionId))
    if (approved) {
      setStats((prev) => ({
        ...prev,
        activeTokens: prev.activeTokens - pendingRedemptions.find((r) => r.id === redemptionId)?.tokens || 0,
        redeemedTokens: prev.redeemedTokens + (pendingRedemptions.find((r) => r.id === redemptionId)?.tokens || 0),
        mealsProvided: prev.mealsProvided + 1,
      }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <Store className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white">{stats.name}</h1>
              {stats.verified && <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Verified</Badge>}
            </div>
            <div className="flex items-center gap-4 text-sm text-white/70">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{stats.address}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-400" />
                <span>
                  {stats.rating} ({stats.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Store className="w-4 h-4 mr-2" />
          Manage Menu
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glassmorphism border-white/20 p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-2">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">${stats.totalReceived}</div>
          <div className="text-sm text-white/70">Total Received</div>
          <div className="text-xs text-green-400 mt-1 flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +15% this month
          </div>
        </Card>

        <Card className="glassmorphism border-white/20 p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-2">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.mealsProvided}</div>
          <div className="text-sm text-white/70">Meals Provided</div>
          <div className="text-xs text-blue-400 mt-1">Community Impact</div>
        </Card>

        <Card className="glassmorphism border-white/20 p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-2">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.activeTokens}</div>
          <div className="text-sm text-white/70">Active Tokens</div>
          <div className="text-xs text-primary mt-1">{stats.redeemedTokens} redeemed</div>
        </Card>

        <Card className="glassmorphism border-white/20 p-4 text-center">
          <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-2">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{pendingRedemptions.length}</div>
          <div className="text-sm text-white/70">Pending Requests</div>
          <div className="text-xs text-yellow-400 mt-1">Needs attention</div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending redemptions */}
        <Card className="glassmorphism border-white/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            Pending Redemptions
          </h3>

          <div className="space-y-3">
            {pendingRedemptions.map((redemption) => (
              <div key={redemption.id} className="p-4 bg-white/5 rounded-lg border border-yellow-400/30">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-medium">{redemption.user}</h4>
                    <p className="text-sm text-white/70">{redemption.requestedMeal}</p>
                    <p className="text-xs text-white/50 mt-1">{new Date(redemption.timestamp).toLocaleString()}</p>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30">{redemption.tokens} tokens</Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleRedemption(redemption.id, true)}
                    className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRedemption(redemption.id, false)}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10 flex-1"
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}

            {pendingRedemptions.length === 0 && (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <h4 className="text-white font-medium mb-2">No pending redemptions</h4>
                <p className="text-white/70 text-sm">All requests have been processed</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent donations */}
        <Card className="glassmorphism border-white/20 p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Recent Donations
          </h3>

          <div className="space-y-3">
            {stats.recentDonations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">{donation.donor}</h4>
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

      {/* Monthly trend */}
      <Card className="glassmorphism border-white/20 p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-secondary" />
          Monthly Performance
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {stats.monthlyTrend.map((month) => (
            <div key={month.month} className="space-y-3">
              <h4 className="text-lg font-medium text-white">{month.month} 2024</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Donations Received</span>
                  <span className="text-white font-medium">${month.donations}</span>
                </div>
                <Progress value={(month.donations / 2000) * 100} className="h-2 bg-white/20" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Tokens Redeemed</span>
                  <span className="text-white font-medium">{month.redemptions}</span>
                </div>
                <Progress value={(month.redemptions / 400) * 100} className="h-2 bg-white/20" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
