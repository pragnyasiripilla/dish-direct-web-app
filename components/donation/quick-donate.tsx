"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Gift } from "lucide-react"
import { DonationModal } from "./donation-modal"

interface Restaurant {
  id: string
  name: string
  address: string
  cuisine: string
  rating: number
  verified: boolean
}

interface QuickDonateProps {
  onDonate: (amount: number, restaurant: Restaurant) => void
  selectedRestaurant: Restaurant | null
}

const QUICK_AMOUNTS = [
  { amount: 5, tokens: 1, label: "Coffee", icon: "☕" },
  { amount: 15, tokens: 3, label: "Lunch", icon: "🍽️" },
  { amount: 25, tokens: 5, label: "Dinner", icon: "🍛" },
  { amount: 50, tokens: 10, label: "Family Meal", icon: "👨‍👩‍👧‍👦" },
]

export function QuickDonate({ onDonate, selectedRestaurant }: QuickDonateProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handleQuickDonate = () => {
    if (selectedAmount && selectedRestaurant) {
      setShowPaymentModal(true)
    }
  }

  const handlePaymentComplete = (donation: any) => {
    onDonate(selectedAmount!, selectedRestaurant!)
    setShowPaymentModal(false)
    setSelectedAmount(null)
  }

  return (
    <>
      <Card className="glassmorphism border-white/20 p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Quick Donate</h3>
          <p className="text-white/70 text-sm">Choose an amount and start sharing meals instantly</p>
        </div>

        {selectedRestaurant && (
          <Card className="glassmorphism border-white/20 p-3 mb-4">
            <div className="text-center">
              <div className="text-sm font-medium text-white">{selectedRestaurant.name}</div>
              <div className="text-xs text-white/60">{selectedRestaurant.cuisine}</div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6">
          {QUICK_AMOUNTS.map((option) => (
            <Button
              key={option.amount}
              variant={selectedAmount === option.amount ? "default" : "outline"}
              className={`h-auto p-4 flex flex-col items-center gap-2 ${
                selectedAmount === option.amount
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "border-white/20 text-white hover:bg-white/10 bg-transparent"
              }`}
              onClick={() => setSelectedAmount(option.amount)}
            >
              <div className="text-2xl">{option.icon}</div>
              <div className="text-center">
                <div className="font-semibold">${option.amount}</div>
                <div className="text-xs opacity-80">{option.label}</div>
                <div className="text-xs flex items-center justify-center gap-1 mt-1">
                  <Gift className="w-3 h-3" />
                  {option.tokens} tokens
                </div>
              </div>
            </Button>
          ))}
        </div>

        <Button
          onClick={handleQuickDonate}
          disabled={!selectedAmount || !selectedRestaurant}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground ripple-effect"
        >
          <Heart className="w-4 h-4 mr-2" />
          {!selectedRestaurant ? "Select Restaurant First" : `Donate $${selectedAmount || 0}`}
        </Button>

        <div className="mt-4 text-center">
          <p className="text-xs text-white/60">Every $5 = 1 meal token • Every $10 = 1 scratch card</p>
        </div>
      </Card>

      <DonationModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        restaurant={selectedRestaurant}
        onDonationComplete={handlePaymentComplete}
        preselectedAmount={selectedAmount}
      />
    </>
  )
}
