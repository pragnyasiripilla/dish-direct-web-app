"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScratchCard } from "./scratch-card"
import { Zap, Gift, Sparkles } from "lucide-react"

interface ScratchCardData {
  id: string
  reward: {
    type: "tokens" | "badge" | "discount" | "theme"
    value: number | string
    title: string
    description: string
    rarity: "common" | "rare" | "epic" | "legendary"
  }
  isRevealed: boolean
  earnedDate: string
}

interface ScratchCardCollectionProps {
  cards: ScratchCardData[]
  onCardReveal: (cardId: string, reward: any) => void
}

export function ScratchCardCollection({ cards, onCardReveal }: ScratchCardCollectionProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const unrevealedCards = cards.filter((card) => !card.isRevealed)
  const revealedCards = cards.filter((card) => card.isRevealed)

  const handleReveal = (reward: any) => {
    if (selectedCard) {
      onCardReveal(selectedCard, reward)
      setSelectedCard(null)
    }
  }

  if (cards.length === 0) {
    return (
      <Card className="glassmorphism border-white/20 p-8 text-center">
        <div className="text-white/50 mb-4">
          <Zap className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-white font-medium mb-2">No scratch cards yet</h3>
        <p className="text-white/70 text-sm">Donate meals to earn scratch cards and unlock rewards</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-secondary" />
          <h2 className="text-2xl font-bold text-white">Scratch Cards</h2>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-secondary/20 text-secondary border-secondary/30">
            {unrevealedCards.length} unrevealed
          </Badge>
          <Badge className="bg-primary/20 text-primary border-primary/30">{revealedCards.length} collected</Badge>
        </div>
      </div>

      {/* Unrevealed cards */}
      {unrevealedCards.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-secondary" />
            Ready to Scratch ({unrevealedCards.length})
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unrevealedCards.map((card) => (
              <div key={card.id}>
                <ScratchCard id={card.id} reward={card.reward} onReveal={handleReveal} isRevealed={false} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revealed cards */}
      {revealedCards.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Rewards Collected ({revealedCards.length})
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {revealedCards.map((card) => (
              <Card key={card.id} className="glassmorphism border-white/20 p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-white text-sm mb-1">{card.reward.title}</h4>
                <p className="text-xs text-white/70 mb-2">{card.reward.description}</p>
                <div className="text-sm font-bold text-primary">
                  {card.reward.type === "tokens" ? `+${card.reward.value}` : card.reward.value}
                </div>
                <p className="text-xs text-white/50 mt-2">{new Date(card.earnedDate).toLocaleDateString()}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
