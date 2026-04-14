"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Gift, Zap, Trophy, Sparkles } from "lucide-react"

interface PaymentSuccessProps {
  isOpen: boolean
  onClose: () => void
  donation: {
    amount: number
    tokens: number
    scratchCards: number
    restaurantName: string
  } | null
}

export function PaymentSuccess({ isOpen, onClose, donation }: PaymentSuccessProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      // Hide confetti after animation
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!donation) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphism border-white/20 text-white max-w-md">
        {/* Confetti effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            ))}
          </div>
        )}

        <div className="text-center space-y-6 relative z-10">
          {/* Success icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Heart className="w-10 h-10 text-white" />
          </div>

          {/* Success message */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
            <p className="text-white/70">
              Your ${donation.amount} donation to {donation.restaurantName} was successful
            </p>
          </div>

          {/* Rewards earned */}
          <Card className="glassmorphism border-white/20 p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center justify-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Rewards Earned
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-white">Meal Tokens</span>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30">+{donation.tokens}</Badge>
              </div>

              {donation.scratchCards > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-secondary" />
                    </div>
                    <span className="text-white">Scratch Cards</span>
                  </div>
                  <Badge className="bg-secondary/20 text-secondary border-secondary/30 shimmer">
                    +{donation.scratchCards}
                  </Badge>
                </div>
              )}
            </div>
          </Card>

          {/* Impact message */}
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-4 border border-white/10">
            <p className="text-white/80 text-sm">
              Your donation will help provide {Math.floor(donation.amount / 5)} meals to those in need. Every
              contribution creates ripples of kindness in our community.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              Close
            </Button>
            {donation.scratchCards > 0 && (
              <Button className="flex-1 bg-secondary hover:bg-secondary/90 text-white ripple-effect">
                <Zap className="w-4 h-4 mr-2" />
                Scratch Cards
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
