"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Heart, Users, Zap } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with spotlight gradient */}
      <div className="absolute inset-0 spotlight-gradient opacity-50" />

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-secondary rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-accent rounded-full animate-pulse delay-500" />
        <div className="absolute bottom-20 right-10 w-1 h-1 bg-primary rounded-full animate-pulse delay-1500" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-balance">
            Share Meals, <span className="text-primary drop-shadow-lg">Share Hope</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 mb-8 text-pretty leading-relaxed">
            Connect with your community through DishDirect - where every donation creates ripples of kindness, gamified
            giving meets social impact, and meals become bridges between hearts.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/donate">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-4 ripple-effect drop-shadow-lg"
              >
                <Heart className="w-5 h-5 mr-2" />
                Start Donating
              </Button>
            </Link>
            <Link href="/discover">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Explore Map
              </Button>
            </Link>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="glassmorphism border-white/20 p-6 text-center hover:bg-white/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Discover Nearby</h3>
              <p className="text-white/70">
                Find restaurants and food spots within 10km using smart location detection
              </p>
            </Card>

            <Card className="glassmorphism border-white/20 p-6 text-center hover:bg-white/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Scratch & Win</h3>
              <p className="text-white/70">
                Every donation unlocks scratch cards with bonus tokens and exclusive rewards
              </p>
            </Card>

            <Card className="glassmorphism border-white/20 p-6 text-center hover:bg-white/20 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Community Impact</h3>
              <p className="text-white/70">Join leaderboards, earn badges, and track your social impact in real-time</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
