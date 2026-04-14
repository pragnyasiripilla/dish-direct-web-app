"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Search, Heart } from "lucide-react"

interface Restaurant {
  id: string
  name: string
  address: string
  cuisine: string
  rating: number
  verified: boolean
  distance?: number
}

interface RestaurantSelectorProps {
  onSelectRestaurant: (restaurant: Restaurant) => void
  selectedRestaurant: Restaurant | null
}

export function RestaurantSelector({ onSelectRestaurant, selectedRestaurant }: RestaurantSelectorProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      const response = await fetch("/api/restaurants")
      const data = await response.json()

      if (data.success) {
        setRestaurants(data.restaurants)
      }
    } catch (error) {
      console.error("Failed to fetch restaurants:", error)
      setRestaurants([
        {
          id: "1",
          name: "Mama's Kitchen",
          address: "123 Main St, Downtown",
          cuisine: "Italian",
          rating: 4.8,
          verified: true,
          distance: 0.5,
        },
        {
          id: "2",
          name: "Spice Garden",
          address: "456 Oak Ave, Midtown",
          cuisine: "Indian",
          rating: 4.6,
          verified: true,
          distance: 1.2,
        },
        {
          id: "3",
          name: "Green Bowl",
          address: "789 Pine St, Uptown",
          cuisine: "Healthy",
          rating: 4.7,
          verified: false,
          distance: 2.1,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRestaurants = restaurants.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (isLoading) {
    return (
      <Card className="glassmorphism border-white/20 p-6">
        <div className="text-center text-white/70">Loading restaurants...</div>
      </Card>
    )
  }

  return (
    <Card className="glassmorphism border-white/20 p-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
          <Heart className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Choose Restaurant</h3>
        <p className="text-white/70 text-sm">Select which restaurant to support with your donation</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 w-4 h-4 text-white/50" />
        <Input
          placeholder="Search restaurants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
        />
      </div>

      {/* Restaurant List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {filteredRestaurants.map((restaurant) => (
          <Card
            key={restaurant.id}
            className={`p-4 cursor-pointer transition-all ${
              selectedRestaurant?.id === restaurant.id
                ? "bg-primary/20 border-primary"
                : "glassmorphism border-white/20 hover:bg-white/5"
            }`}
            onClick={() => onSelectRestaurant(restaurant)}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-white text-sm">{restaurant.name}</h4>
                  {restaurant.verified && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Verified</Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-white/70 mb-1">
                  <MapPin className="w-3 h-3" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-white/60">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span>{restaurant.rating}</span>
                  <span className="mx-1">•</span>
                  <span>{restaurant.cuisine}</span>
                  {restaurant.distance && (
                    <>
                      <span className="mx-1">•</span>
                      <span>{restaurant.distance} mi</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredRestaurants.length === 0 && (
        <div className="text-center text-white/70 py-8">No restaurants found matching your search.</div>
      )}
    </Card>
  )
}
