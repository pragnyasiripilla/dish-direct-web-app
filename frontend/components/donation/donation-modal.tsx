"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Star, MapPin, CreditCard, Gift, Zap, Smartphone, Wallet } from "lucide-react"

interface Restaurant {
  id: string
  name: string
  address: string
  cuisine: string
  rating: number
  verified: boolean
}

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
  restaurant: Restaurant | null
  onDonationComplete: (donation: any) => void
  preselectedAmount?: number | null // Add preselected amount prop
}

const DONATION_AMOUNTS = [5, 10, 25, 50, 100]

const PAYMENT_METHODS = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, description: "Visa, Mastercard, American Express" },
  { id: "upi", name: "UPI", icon: Smartphone, description: "PhonePe, Google Pay, Paytm" },
  { id: "wallet", name: "Digital Wallet", icon: Wallet, description: "PayPal, Razorpay Wallet" },
]

export function DonationModal({
  isOpen,
  onClose,
  restaurant,
  onDonationComplete,
  preselectedAmount,
}: DonationModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(preselectedAmount || null)
  const [customAmount, setCustomAmount] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [donorMessage, setDonorMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("card")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [upiId, setUpiId] = useState("")

  useEffect(() => {
    if (preselectedAmount) {
      setSelectedAmount(preselectedAmount)
      setCustomAmount("")
    }
  }, [preselectedAmount])

  const finalAmount = selectedAmount || Number.parseFloat(customAmount) || 0
  const tokensToEarn = Math.floor(finalAmount / 5) // 1 token per $5
  const scratchCardsToEarn = Math.floor(finalAmount / 10) // 1 scratch card per $10

  const handleDonate = async () => {
    if (finalAmount < 5) return

    setIsProcessing(true)

    try {
      // Create payment intent based on selected method
      const paymentData = {
        restaurantId: restaurant?.id,
        amount: finalAmount,
        tokens: tokensToEarn,
        scratchCards: scratchCardsToEarn,
        isAnonymous,
        message: donorMessage,
        timestamp: new Date().toISOString(),
        paymentMethod: selectedPaymentMethod,
      }

      // Process payment based on selected method
      if (selectedPaymentMethod === "card") {
        // Validate card details
        if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
          throw new Error("Please fill in all card details")
        }

        // TODO: Integrate with Stripe for card payments
        console.log("[v0] Processing card payment:", { ...cardDetails, number: cardDetails.number.slice(-4) })

        // Simulate Stripe payment processing
        await new Promise((resolve) => setTimeout(resolve, 3000))
      } else if (selectedPaymentMethod === "upi") {
        // Validate UPI ID
        if (!upiId) {
          throw new Error("Please enter your UPI ID")
        }

        // TODO: Integrate with UPI payment gateway
        console.log("[v0] Processing UPI payment:", upiId)

        // Simulate UPI payment processing
        await new Promise((resolve) => setTimeout(resolve, 2500))
      } else if (selectedPaymentMethod === "wallet") {
        // TODO: Integrate with PayPal/Razorpay Wallet
        console.log("[v0] Processing wallet payment")

        // Simulate wallet payment processing
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      // TODO: Send payment data to backend API
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        throw new Error("Payment processing failed")
      }

      const result = await response.json()
      console.log("[v0] Payment successful:", result)

      onDonationComplete(paymentData)
      onClose()
    } catch (error) {
      console.error("Donation failed:", error)
      alert(`Payment failed: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setSelectedAmount(null)
    setCustomAmount("")
    setIsAnonymous(false)
    setDonorMessage("")
    setSelectedPaymentMethod("card")
    setCardDetails({ number: "", expiry: "", cvv: "", name: "" })
    setUpiId("")
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
          resetForm()
        }
      }}
    >
      <DialogContent className="glassmorphism border-white/20 text-white max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Donate Meals</DialogTitle>
          <DialogDescription className="text-white/70 text-center">
            Support {restaurant?.name} and earn rewards
          </DialogDescription>
        </DialogHeader>

        {restaurant && (
          <Card className="glassmorphism border-white/20 p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{restaurant.name}</h3>
                  {restaurant.verified && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Verified</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-white/70 mb-1">
                  <MapPin className="w-3 h-3" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-white/60">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span>{restaurant.rating}</span>
                  <span className="mx-1">•</span>
                  <span>{restaurant.cuisine}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-6">
          {/* Amount selection */}
          <div>
            <Label className="text-white mb-3 block">Select donation amount</Label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {DONATION_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? "default" : "outline"}
                  className={
                    selectedAmount === amount
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "border-white/20 text-white hover:bg-white/10 bg-transparent"
                  }
                  onClick={() => {
                    setSelectedAmount(amount)
                    setCustomAmount("")
                  }}
                >
                  ${amount}
                </Button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-3 text-white/50">$</span>
              <Input
                type="number"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value)
                  setSelectedAmount(null)
                }}
                className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                min="5"
                step="1"
              />
            </div>
          </div>

          {finalAmount >= 5 && (
            <div>
              <Label className="text-white mb-3 block">Payment Method</Label>
              <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-white/20">
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method.id} value={method.id} className="text-white hover:bg-white/10">
                      <div className="flex items-center gap-2">
                        <method.icon className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{method.name}</div>
                          <div className="text-xs text-white/60">{method.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedPaymentMethod === "card" && (
                <div className="mt-4 space-y-3">
                  <Input
                    placeholder="Card Number"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails((prev) => ({ ...prev, number: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                    maxLength={19}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails((prev) => ({ ...prev, expiry: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                      maxLength={5}
                    />
                    <Input
                      placeholder="CVV"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails((prev) => ({ ...prev, cvv: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                      maxLength={4}
                    />
                  </div>
                  <Input
                    placeholder="Cardholder Name"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails((prev) => ({ ...prev, name: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                  />
                </div>
              )}

              {selectedPaymentMethod === "upi" && (
                <div className="mt-4">
                  <Input
                    placeholder="Enter UPI ID (e.g., user@paytm)"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
                  />
                </div>
              )}
            </div>
          )}

          {/* Rewards preview */}
          {finalAmount >= 5 && (
            <Card className="glassmorphism border-white/20 p-4">
              <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                <Gift className="w-4 h-4 text-primary" />
                You'll earn
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Meal Tokens</span>
                  <span className="text-primary font-medium">{tokensToEarn}</span>
                </div>
                {scratchCardsToEarn > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/70">Scratch Cards</span>
                    <span className="text-secondary font-medium flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {scratchCardsToEarn}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Message */}
          <div>
            <Label htmlFor="message" className="text-white mb-2 block">
              Message (optional)
            </Label>
            <Input
              id="message"
              placeholder="Add a message of hope..."
              value={donorMessage}
              onChange={(e) => setDonorMessage(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
              maxLength={100}
            />
          </div>

          {/* Anonymous option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
              className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label htmlFor="anonymous" className="text-sm text-white/70">
              Make this donation anonymous
            </Label>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDonate}
              disabled={finalAmount < 5 || isProcessing}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground ripple-effect"
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Donate ${finalAmount}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
