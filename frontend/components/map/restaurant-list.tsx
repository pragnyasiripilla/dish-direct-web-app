"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Star, Heart, Clock, Search, Navigation } from "lucide-react"
import { RestaurantDonationModal } from "@/components/donation/restaurant-donation-modal"

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

interface RestaurantListProps {
  restaurants: Restaurant[]
  onRestaurantSelect: (restaurant: Restaurant) => void
  userLocation?: { lat: number; lng: number }
}

export function RestaurantList({ restaurants, onRestaurantSelect, userLocation }: RestaurantListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [cuisineFilter, setCuisineFilter] = useState("all")
  const [sortBy, setSortBy] = useState("distance")
  const [selectedRestaurantForDonation, setSelectedRestaurantForDonation] = useState<Restaurant | null>(null)
  const [showDonationModal, setShowDonationModal] = useState(false)

  // Get unique cuisines
  const cuisines = Array.from(new Set(restaurants.map((r) => r.cuisine)))

  // Filter and sort restaurants
  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCuisine = cuisineFilter === "all" || restaurant.cuisine === cuisineFilter
      return matchesSearch && matchesCuisine
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return (a.distance || 0) - (b.distance || 0)
        case "rating":
          return b.rating - a.rating
        case "donations":
          return b.donationsReceived - a.donationsReceived
        default:
          return 0
      }
    })

  const handleDonate = (restaurant: Restaurant, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    setSelectedRestaurantForDonation(restaurant)
    setShowDonationModal(true)
  }

  const getDirections = (restaurant: Restaurant, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    if (userLocation) {
      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${restaurant.lat},${restaurant.lng}`
      window.open(url, "_blank")
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lng}`
      window.open(url, "_blank")
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and filters */}
      <Card className="glassmorphism border-white/20 p-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
            <Input
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
            />
          </div>

          <div className="flex gap-3">
            <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-primary">
                <SelectValue placeholder="Cuisine" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/20">
                <SelectItem value="all" className="text-white hover:bg-white/10">
                  All Cuisines
                </SelectItem>
                {cuisines.map((cuisine) => (
                  <SelectItem key={cuisine} value={cuisine} className="text-white hover:bg-white/10">
                    {cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white focus:border-primary">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/20">
                <SelectItem value="distance" className="text-white hover:bg-white/10">
                  Distance
                </SelectItem>
                <SelectItem value="rating" className="text-white hover:bg-white/10">
                  Rating
                </SelectItem>
                <SelectItem value="donations" className="text-white hover:bg-white/10">
                  Most Donations
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Restaurant list */}
      <div className="space-y-3">
        {filteredRestaurants.map((restaurant) => (
          <Card
            key={restaurant.id}
            className="glassmorphism border-white/20 p-4 hover:bg-white/20 transition-all duration-300 cursor-pointer"
            onClick={() => onRestaurantSelect(restaurant)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">{restaurant.name}</h3>
                  {restaurant.verified && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Verified</Badge>
                  )}
                  <Badge variant="outline" className="border-white/20 text-white/70 text-xs">
                    {restaurant.cuisine}
                  </Badge>
                </div>

                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="w-4 h-4 text-white/50" />
                  <span className="text-sm text-white/70">{restaurant.address}</span>
                  {restaurant.distance && (
                    <span className="text-sm text-primary ml-2">• {restaurant.distance.toFixed(1)}km away</span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{restaurant.rating}</span>
                  </div>
                  {restaurant.openHours && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{restaurant.openHours}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-3 text-sm">
                  <div>
                    <span className="text-white/60">Donations: </span>
                    <span className="text-primary font-medium">{restaurant.donationsReceived}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Tokens: </span>
                    <span className="text-secondary font-medium">{restaurant.tokensAvailable}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => handleDonate(restaurant, e)}
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  Donate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => getDirections(restaurant, e)}
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Directions
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Redeem
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredRestaurants.length === 0 && (
          <Card className="glassmorphism border-white/20 p-8 text-center">
            <div className="text-white/50 mb-2">
              <Search className="w-8 h-8 mx-auto mb-2" />
            </div>
            <h3 className="text-white font-medium mb-1">No restaurants found</h3>
            <p className="text-white/70 text-sm">Try adjusting your search or filters</p>
          </Card>
        )}
      </div>

      {/* Restaurant donation modal */}
      <RestaurantDonationModal
        restaurant={selectedRestaurantForDonation}
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        userLocation={userLocation}
      />
    </div>
  )
}
