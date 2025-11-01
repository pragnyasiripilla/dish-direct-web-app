"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Gift, Sparkles, Trophy, Zap, Star } from "lucide-react"

interface ScratchCardProps {
  id: string
  reward: {
    type: "tokens" | "badge" | "discount" | "theme"
    value: number | string
    title: string
    description: string
    rarity: "common" | "rare" | "epic" | "legendary"
  }
  onReveal: (reward: any) => void
  isRevealed?: boolean
}

export function ScratchCard({ id, reward, onReveal, isRevealed = false }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScratching, setIsScratching] = useState(false)
  const [scratchProgress, setScratchProgress] = useState(0)
  const [revealed, setRevealed] = useState(isRevealed)
  const [showConfetti, setShowConfetti] = useState(false)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-gray-400 to-gray-600"
      case "rare":
        return "from-blue-400 to-blue-600"
      case "epic":
        return "from-purple-400 to-purple-600"
      case "legendary":
        return "from-yellow-400 to-yellow-600"
      default:
        return "from-gray-400 to-gray-600"
    }
  }

  const getRewardIcon = (type: string) => {
    switch (type) {
      case "tokens":
        return <Gift className="w-8 h-8 text-white" />
      case "badge":
        return <Trophy className="w-8 h-8 text-white" />
      case "discount":
        return <Star className="w-8 h-8 text-white" />
      case "theme":
        return <Sparkles className="w-8 h-8 text-white" />
      default:
        return <Gift className="w-8 h-8 text-white" />
    }
  }

  useEffect(() => {
    if (!canvasRef.current || revealed) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 300
    canvas.height = 200

    // Create scratch surface
    ctx.fillStyle = "#666"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add scratch pattern
    ctx.fillStyle = "#888"
    ctx.font = "20px Arial"
    ctx.textAlign = "center"
    ctx.fillText("Scratch to reveal", canvas.width / 2, canvas.height / 2 - 10)
    ctx.fillText("your reward!", canvas.width / 2, canvas.height / 2 + 20)

    // Set up scratch functionality
    ctx.globalCompositeOperation = "destination-out"
  }, [revealed])

  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || revealed) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (isScratching) {
      ctx.beginPath()
      ctx.arc(x, y, 20, 0, 2 * Math.PI)
      ctx.fill()

      // Calculate scratch progress
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imageData.data
      let transparent = 0

      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] === 0) transparent++
      }

      const progress = transparent / (pixels.length / 4)
      setScratchProgress(progress)

      // Reveal when 30% is scratched
      if (progress > 0.3 && !revealed) {
        setRevealed(true)
        setShowConfetti(true)
        onReveal(reward)
        setTimeout(() => setShowConfetti(false), 3000)
      }
    }
  }

  const handleMouseDown = () => setIsScratching(true)
  const handleMouseUp = () => setIsScratching(false)

  const revealCard = () => {
    setRevealed(true)
    setShowConfetti(true)
    onReveal(reward)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  return (
    <Card className="glassmorphism border-white/20 p-6 relative overflow-hidden">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1.5 + Math.random() * 1.5}s`,
              }}
            >
              <Sparkles className="w-3 h-3 text-primary" />
            </div>
          ))}
        </div>
      )}

      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-secondary" />
          <h3 className="text-lg font-semibold text-white">Scratch Card</h3>
          <Badge className={`bg-gradient-to-r ${getRarityColor(reward.rarity)} text-white border-0`}>
            {reward.rarity}
          </Badge>
        </div>

        <div className="relative">
          {!revealed ? (
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="w-full h-32 rounded-lg cursor-pointer border border-white/20"
                onMouseMove={handleScratch}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
              <div className="mt-4">
                <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${scratchProgress * 100}%` }}
                  />
                </div>
                <p className="text-sm text-white/70">
                  {scratchProgress > 0 ? `${Math.round(scratchProgress * 100)}% revealed` : "Start scratching!"}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className={`w-20 h-20 bg-gradient-to-br ${getRarityColor(
                  reward.rarity,
                )} rounded-full flex items-center justify-center mx-auto animate-pulse`}
              >
                {getRewardIcon(reward.type)}
              </div>

              <div>
                <h4 className="text-xl font-bold text-white mb-1">{reward.title}</h4>
                <p className="text-white/70 text-sm mb-3">{reward.description}</p>

                <div className="text-2xl font-bold text-primary">
                  {reward.type === "tokens" ? `+${reward.value} Tokens` : reward.value}
                </div>
              </div>
            </div>
          )}
        </div>

        {!revealed && (
          <Button
            onClick={revealCard}
            variant="outline"
            size="sm"
            className="mt-4 border-white/20 text-white hover:bg-white/10 bg-transparent"
          >
            Reveal Instantly
          </Button>
        )}
      </div>
    </Card>
  )
}
