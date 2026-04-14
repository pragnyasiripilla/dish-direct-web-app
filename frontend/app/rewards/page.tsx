"use client"

import { useState } from "react"
import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { Leaderboard } from "@/components/gamification/leaderboard"
import { BadgeCollection } from "@/components/gamification/badge-collection"
import { ScratchCardCollection } from "@/components/gamification/scratch-card-collection"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Zap, Gift, Target } from "lucide-react"

export default function RewardsPage() {
  const [leaderboardTimeframe, setLeaderboardTimeframe] = useState<"weekly" | "monthly" | "all-time">("weekly")
  const [scratchCards, setScratchCards] = useState([
    {
      id: "card-1",
      reward: {
        type: "tokens" as const,
        value: 10,
        title: "Bonus Tokens",
        description: "Extra meal tokens for your generosity",
        rarity: "common" as const,
      },
      isRevealed: false,
      earnedDate: new Date().toISOString(),
    },
    {
      id: "card-2",
      reward: {
        type: "badge" as const,
        value: "Generous Heart",
        title: "New Badge",
        description: "Unlock the Generous Heart badge",
        rarity: "rare" as const,
      },
      isRevealed: false,
      earnedDate: new Date().toISOString(),
    },
  ])

  const [badges] = useState([
    {
      id: "first-donation",
      name: "First Steps",
      description: "Made your first donation",
      icon: "heart",
      rarity: "common" as const,
      earned: true,
      earnedDate: "2024-01-15",
    },
    {
      id: "generous-heart",
      name: "Generous Heart",
      description: "Donated $100 or more",
      icon: "star",
      rarity: "rare" as const,
      earned: true,
      earnedDate: "2024-01-20",
    },
    {
      id: "community-hero",
      name: "Community Hero",
      description: "Helped 50 people with meals",
      icon: "users",
      rarity: "epic" as const,
      earned: false,
      progress: 23,
      maxProgress: 50,
    },
    {
      id: "meal-master",
      name: "Meal Master",
      description: "Shared 1000 meals",
      icon: "crown",
      rarity: "legendary" as const,
      earned: false,
      progress: 156,
      maxProgress: 1000,
    },
  ])

  const [leaderboard] = useState([
    {
      id: "user-1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      totalDonations: 2450,
      mealsShared: 490,
      tokensEarned: 245,
      badges: ["First Steps", "Generous Heart", "Community Hero"],
      rank: 1,
      isCurrentUser: false,
    },
    {
      id: "user-2",
      name: "You",
      totalDonations: 1850,
      mealsShared: 370,
      tokensEarned: 185,
      badges: ["First Steps", "Generous Heart"],
      rank: 2,
      isCurrentUser: true,
    },
    {
      id: "user-3",
      name: "Mike Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      totalDonations: 1650,
      mealsShared: 330,
      tokensEarned: 165,
      badges: ["First Steps", "Generous Heart"],
      rank: 3,
      isCurrentUser: false,
    },
  ])

  const handleCardReveal = (cardId: string, reward: any) => {
    setScratchCards((prev) => prev.map((card) => (card.id === cardId ? { ...card, isRevealed: true } : card)))
    // TODO: Update user rewards in backend
    console.log("Card revealed:", cardId, reward)
  }

  return (
    <main className="min-h-screen bg-background">
      <GlassmorphismNav />

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">Rewards & Achievements</h1>
            <p className="text-xl text-white/70 text-pretty">
              Track your impact, collect rewards, and climb the leaderboard
            </p>
          </div>

          {/* Stats overview */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="glassmorphism border-white/20 p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">2nd</div>
              <div className="text-sm text-white/70">Leaderboard Rank</div>
            </Card>

            <Card className="glassmorphism border-white/20 p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">2</div>
              <div className="text-sm text-white/70">Badges Earned</div>
            </Card>

            <Card className="glassmorphism border-white/20 p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">{scratchCards.filter((c) => !c.isRevealed).length}</div>
              <div className="text-sm text-white/70">Scratch Cards</div>
            </Card>

            <Card className="glassmorphism border-white/20 p-4 text-center">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-white">185</div>
              <div className="text-sm text-white/70">Total Tokens</div>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="scratch-cards" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 border border-white/20">
              <TabsTrigger
                value="scratch-cards"
                className="text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Zap className="w-4 h-4 mr-2" />
                Scratch Cards
              </TabsTrigger>
              <TabsTrigger
                value="badges"
                className="text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Gift className="w-4 h-4 mr-2" />
                Badges
              </TabsTrigger>
              <TabsTrigger
                value="leaderboard"
                className="text-white data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scratch-cards" className="mt-6">
              <ScratchCardCollection cards={scratchCards} onCardReveal={handleCardReveal} />
            </TabsContent>

            <TabsContent value="badges" className="mt-6">
              <BadgeCollection badges={badges} />
            </TabsContent>

            <TabsContent value="leaderboard" className="mt-6">
              <Leaderboard
                entries={leaderboard}
                timeframe={leaderboardTimeframe}
                onTimeframeChange={setLeaderboardTimeframe}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
