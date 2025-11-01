"use client"

import { Card } from "@/components/ui/card"
import { Heart, Users, MapPin, Trophy } from "lucide-react"

export function ImpactStats() {
  const stats = [
    {
      icon: Heart,
      value: "12,847",
      label: "Meals Shared",
      gradient: "from-primary to-secondary",
    },
    {
      icon: Users,
      value: "3,421",
      label: "Active Donors",
      gradient: "from-secondary to-primary",
    },
    {
      icon: MapPin,
      value: "156",
      label: "Partner Restaurants",
      gradient: "from-primary to-accent",
    },
    {
      icon: Trophy,
      value: "8,932",
      label: "Rewards Unlocked",
      gradient: "from-accent to-secondary",
    },
  ]

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">Real-Time Impact</h2>
          <p className="text-xl text-white/70 text-pretty">
            See the difference we're making together, one meal at a time
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="glassmorphism border-white/20 p-6 text-center hover:bg-white/20 transition-all duration-300 group"
            >
              <div
                className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 shimmer">{stat.value}</div>
              <div className="text-white/70 text-sm md:text-base">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
