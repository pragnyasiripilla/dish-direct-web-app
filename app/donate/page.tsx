"use client"

import { useState, useEffect } from "react"
import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { QuickDonate } from "@/components/donation/quick-donate"
import { DonationHistory } from "@/components/donation/donation-history"
import { DonationModal } from "@/components/donation/donation-modal"
import { PaymentSuccess } from "@/components/donation/payment-success"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, TrendingUp, Users, Gift } from "lucide-react"
import { RestaurantSelector } from "@/components/donation/restaurant-selector"

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

export default function DonatePage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [lastDonation, setLastDonation] = useState<any>(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null)

  // Mock restaurant for quick donate
  const mockRestaurant = {
    id: "quick-donate",
    name: "Community Pool",
    address: "Distributed to nearby restaurants",
    cuisine: "Various",
    rating: 4.8,
    verified: true,
  }

  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    try {
      const response = await fetch("/api/donations?userId=current-user")
      const data = await response.json()
      if (data.success) {
        setDonations(data.donations)
      }
    } catch (error) {
      console.error("Failed to fetch donations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickDonate = (amount: number, restaurant: any) => {
    const donation = {
      restaurantId: restaurant.id,
      amount,
      tokens: Math.floor(amount / 5),
      scratchCards: Math.floor(amount / 10),
      isAnonymous: false,
      message: "",
      timestamp: new Date().toISOString(),
    }

    setLastDonation({
      ...donation,
      restaurantName: restaurant.name,
    })
    setShowSuccessModal(true)

    const newDonation: Donation = {
      id: `donation_${Date.now()}`,
      restaurantName: restaurant.name,
      restaurantAddress: restaurant.address,
      amount,
      tokens: Math.floor(amount / 5),
      scratchCards: Math.floor(amount / 10),
      isAnonymous: false,
      timestamp: new Date().toISOString(),
      status: "completed",
    }

    setDonations((prev) => [newDonation, ...prev])
  }

  const handleDonationComplete = (donation: any) => {
    setLastDonation(donation)
    setShowSuccessModal(true)

    const newDonation: Donation = {
      id: `donation_${Date.now()}`,
      restaurantName: selectedRestaurant?.name || "Unknown Restaurant",
      restaurantAddress: selectedRestaurant?.address || "Unknown Address",
      ...donation,
      status: "completed",
    }

    setDonations((prev) => [newDonation, ...prev])
  }

  const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0)
  const totalTokens = donations.reduce((sum, donation) => sum + donation.tokens, 0)
  const totalScratchCards = donations.reduce((sum, donation) => sum + donation.scratchCards, 0)

  return (
    <main className="min-h-screen bg-background">
      <GlassmorphismNav />

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">Share Meals</h1>
            <p className="text-xl text-white/70 text-pretty">
              Every donation creates ripples of kindness in our community
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="glassmorphism border-white/20 p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">${totalDonated}</div>
              <div className="text-sm text-white/70">Total Donated</div>
            </Card>

            <Card className="glassmorphism border-white/20 p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{totalTokens}</div>
              <div className="text-sm text-white/70">Tokens Earned</div>
            </Card>

            <Card className="glassmorphism border-white/20 p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{totalScratchCards}</div>
              <div className="text-sm text-white/70">Scratch Cards</div>
            </Card>

            <Card className="glassmorphism border-white/20 p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{Math.floor(totalDonated / 5)}</div>
              <div className="text-sm text-white/70">Meals Shared</div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <RestaurantSelector onSelectRestaurant={setSelectedRestaurant} selectedRestaurant={selectedRestaurant} />

              <QuickDonate onDonate={handleQuickDonate} selectedRestaurant={selectedRestaurant} />

              <div className="mt-6">
                <Button
                  onClick={() => setShowDonationModal(true)}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                  disabled={!selectedRestaurant}
                >
                  {!selectedRestaurant ? "Select Restaurant First" : "Custom Donation"}
                </Button>
              </div>
            </div>

            {/* Donation history */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <Card className="glassmorphism border-white/20 p-8 text-center">
                  <div className="text-white/70">Loading donation history...</div>
                </Card>
              ) : (
                <DonationHistory donations={donations} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DonationModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        restaurant={selectedRestaurant}
        onDonationComplete={handleDonationComplete}
      />

      <PaymentSuccess isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} donation={lastDonation} />
    </main>
  )
}
