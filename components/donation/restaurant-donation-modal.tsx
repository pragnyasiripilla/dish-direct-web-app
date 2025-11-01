"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Star, Heart, CreditCard, Smartphone, Wallet, Navigation } from "lucide-react"

interface Restaurant {
  id: string
  name: string
  lat: number
  lng: number
  address: string
  cuisine: string
  rating: number
  verified: boolean
  phone?: string
  openHours?: string
  donationsReceived: number
  tokensAvailable: number
  distance?: number
}

interface RestaurantDonationModalProps {
  restaurant: Restaurant | null
  isOpen: boolean
  onClose: () => void
  userLocation?: { lat: number; lng: number }
}

export function RestaurantDonationModal({ restaurant, isOpen, onClose, userLocation }: RestaurantDonationModalProps) {
  const [donationAmount, setDonationAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const predefinedAmounts = [50, 100, 250, 500, 1000]

  const handleAmountSelect = (amount: number) => {
    setDonationAmount(amount.toString())
  }

  const handleGetDirections = () => {
    if (restaurant && userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${restaurant.lat},${restaurant.lng}`
      window.open(url, "_blank")
    } else if (restaurant) {
      const url = `https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}`
      window.open(url, "_blank")
    }
  }

  const handleDonate = () => {
    if (!donationAmount || !paymentMethod) return
    setShowPayment(true)
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Here you would integrate with actual payment gateway
      console.log("[v0] Processing donation:", {
        restaurantId: restaurant?.id,
        amount: donationAmount,
        paymentMethod,
      })

      // Reset form and close modal
      setDonationAmount("")
      setPaymentMethod("")
      setShowPayment(false)
      onClose()

      // Show success message (you could add a toast here)
      alert(`Successfully donated ₹${donationAmount} to ${restaurant?.name}!`)
    } catch (error) {
      console.error("[v0] Payment failed:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!restaurant) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphism border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Donate to {restaurant.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Restaurant Info */}
          <Card className="glassmorphism border-white/20 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{restaurant.name}</h3>
                  {restaurant.verified && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Verified</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-white/70 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-white/70">{restaurant.rating}</span>
                  </div>
                  <Badge variant="outline" className="border-white/20 text-white/70 text-xs">
                    {restaurant.cuisine}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-white/60">Donations: </span>
                  <span className="text-primary font-medium">{restaurant.donationsReceived}</span>
                </div>
                <div>
                  <span className="text-white/60">Tokens: </span>
                  <span className="text-secondary font-medium">{restaurant.tokensAvailable}</span>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={handleGetDirections}
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Navigation className="w-4 h-4 mr-1" />
                Directions
              </Button>
            </div>
          </Card>

          {!showPayment ? (
            <>
              {/* Donation Amount */}
              <div className="space-y-3">
                <Label className="text-white">Donation Amount (₹)</Label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {predefinedAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={donationAmount === amount.toString() ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAmountSelect(amount)}
                      className={
                        donationAmount === amount.toString()
                          ? "bg-primary hover:bg-primary/90"
                          : "border-white/20 text-white hover:bg-white/10 bg-transparent"
                      }
                    >
                      ₹{amount}
                    </Button>
                  ))}
                </div>
                <Input
                  type="number"
                  placeholder="Enter custom amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <Label className="text-white">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-primary">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    <SelectItem value="card" className="text-white hover:bg-white/10">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Credit/Debit Card
                      </div>
                    </SelectItem>
                    <SelectItem value="upi" className="text-white hover:bg-white/10">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        UPI
                      </div>
                    </SelectItem>
                    <SelectItem value="wallet" className="text-white hover:bg-white/10">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        Digital Wallet
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDonate}
                  disabled={!donationAmount || !paymentMethod}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Donate ₹{donationAmount || "0"}
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Payment Processing */}
              <div className="text-center space-y-4">
                <div className="text-lg font-semibold text-white">Complete Payment</div>
                <div className="text-white/70">
                  Donating ₹{donationAmount} to {restaurant.name}
                </div>
                <div className="text-white/70">
                  Payment Method:{" "}
                  {paymentMethod === "card" ? "Credit/Debit Card" : paymentMethod === "upi" ? "UPI" : "Digital Wallet"}
                </div>

                <Card className="glassmorphism border-white/20 p-4">
                  <div className="text-sm text-white/60 mb-2">
                    This is a demo. In production, this would redirect to the actual payment gateway.
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowPayment(false)}
                    disabled={isProcessing}
                    className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isProcessing ? "Processing..." : "Pay Now"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
