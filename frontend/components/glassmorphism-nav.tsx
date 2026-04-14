"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Heart, Trophy, Menu, X, BarChart3 } from "lucide-react"
import Link from "next/link"

export function GlassmorphismNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism border-b border-white/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white drop-shadow-sm">DishDirect</span>
          </Link>

          {/* Desktop Navigation - Updated with dashboard link */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/discover">
              <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-primary drop-shadow-sm">
                <MapPin className="w-4 h-4 mr-2" />
                Discover
              </Button>
            </Link>
            <Link href="/donate">
              <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-primary drop-shadow-sm">
                <Heart className="w-4 h-4 mr-2" />
                Donate
              </Button>
            </Link>
            <Link href="/rewards">
              <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-primary drop-shadow-sm">
                <Trophy className="w-4 h-4 mr-2" />
                Rewards
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-primary drop-shadow-sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/auth/sign-in">
              <Button variant="ghost" className="text-white hover:bg-white/20 drop-shadow-sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-primary hover:bg-primary/90 text-white ripple-effect drop-shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/20 drop-shadow-sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col space-y-2 mt-4">
              <Link href="/discover">
                <Button
                  variant="ghost"
                  className="justify-start text-white hover:bg-white/20 hover:text-primary w-full drop-shadow-sm"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Discover
                </Button>
              </Link>
              <Link href="/donate">
                <Button
                  variant="ghost"
                  className="justify-start text-white hover:bg-white/20 hover:text-primary w-full drop-shadow-sm"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Donate
                </Button>
              </Link>
              <Link href="/rewards">
                <Button
                  variant="ghost"
                  className="justify-start text-white hover:bg-white/20 hover:text-primary w-full drop-shadow-sm"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Rewards
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="justify-start text-white hover:bg-white/20 hover:text-primary w-full drop-shadow-sm"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex flex-col space-y-2 mt-4 pt-4 border-t border-white/20">
                <Link href="/auth/sign-in">
                  <Button variant="ghost" className="justify-start text-white hover:bg-white/20 w-full drop-shadow-sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button className="justify-start bg-primary hover:bg-primary/90 text-white w-full drop-shadow-lg">
                    Get Started
                  </Button>
                </Link>
                
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
