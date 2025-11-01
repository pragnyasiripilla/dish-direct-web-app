"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Calendar, MapPin, Gift, ExternalLink } from "lucide-react"

interface Donation {
  id: string
  restaurantName: string
  restaurantAddress: string
  amount: number
  tokens: number
  scratchCards: number
  isAnonymous: boolean
  message?: string
  timestamp: string
  status: "completed" | "pending" | "failed"
}

interface DonationHistoryProps {
  donations: Donation[]
}

export function DonationHistory({ donations }: DonationHistoryProps) {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-white/20 text-white border-white/30"
    }
  }

  if (donations.length === 0) {
    return (
      <Card className="glassmorphism border-white/20 p-8 text-center">
        <div className="text-white/50 mb-4">
          <Heart className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-white font-medium mb-2">No donations yet</h3>
        <p className="text-white/70 text-sm">Start sharing meals to see your donation history here</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Donation History</h2>
        <Badge className="bg-primary/20 text-primary border-primary/30">{donations.length} donations</Badge>
      </div>

      <div className="space-y-3">
        {donations.map((donation) => (
          <Card key={donation.id} className="glassmorphism border-white/20 p-4 hover:bg-white/20 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-white font-medium">{donation.restaurantName}</h3>
                  <Badge className={getStatusColor(donation.status)}>{donation.status}</Badge>
                </div>

                <div className="flex items-center gap-1 text-sm text-white/70 mb-2">
                  <MapPin className="w-3 h-3" />
                  <span>{donation.restaurantAddress}</span>
                </div>

                <div className="flex items-center gap-1 text-sm text-white/60 mb-3">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(donation.timestamp)}</span>
                </div>

                {donation.message && (
                  <div className="bg-white/10 rounded-lg p-3 mb-3">
                    <p className="text-white/80 text-sm italic">"{donation.message}"</p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Gift className="w-4 h-4 text-primary" />
                    <span className="text-white/70">Tokens:</span>
                    <span className="text-primary font-medium">{donation.tokens}</span>
                  </div>
                  {donation.scratchCards > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-white/70">Cards:</span>
                      <span className="text-secondary font-medium">{donation.scratchCards}</span>
                    </div>
                  )}
                  {donation.isAnonymous && (
                    <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                      Anonymous
                    </Badge>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-white mb-1">${donation.amount}</div>
                <Button size="sm" variant="ghost" className="text-white/50 hover:text-white hover:bg-white/10 p-1">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
