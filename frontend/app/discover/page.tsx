"use client"

import { useState } from "react"
import { GlassmorphismNav } from "@/components/glassmorphism-nav"
import { LocationDetector } from "@/components/map/location-detector"
import { InteractiveMap } from "@/components/map/interactive-map"
import { RestaurantList } from "@/components/map/restaurant-list"
import { discoverRestaurants } from "@/lib/restaurant-service"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Map, List, Loader2 } from "lucide-react"

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

export default function DiscoverPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>()
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"map" | "list">("list")
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)

  const handleLocationDetected = async (location: { lat: number; lng: number }) => {
    setUserLocation(location)
    setIsLoading(true)

    try {
      const discoveredRestaurants = await discoverRestaurants(location)
      setRestaurants(discoveredRestaurants)
    } catch (error) {
      console.error("Failed to discover restaurants:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationError = async (error: string) => {
    console.error("Location error:", error)
    setIsLoading(true)

    try {
      // Load fallback data
      const fallbackRestaurants = await discoverRestaurants()
      setRestaurants(fallbackRestaurants)
    } catch (err) {
      console.error("Failed to load fallback restaurants:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant)
  }

  return (
    <main className="min-h-screen bg-background">
      <GlassmorphismNav />

      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">Discover Restaurants</h1>
            <p className="text-xl text-white/70 text-pretty">
              Find nearby restaurants and start sharing meals with your community
            </p>
          </div>

          {/* Location detector */}
          <div className="mb-6">
            <LocationDetector onLocationDetected={handleLocationDetected} onLocationError={handleLocationError} />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
                className={
                  viewMode === "map"
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "border-white/20 text-white hover:bg-white/10"
                }
              >
                <Map className="w-4 h-4 mr-2" />
                Map View
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "border-white/20 text-white hover:bg-white/10"
                }
              >
                <List className="w-4 h-4 mr-2" />
                List View
              </Button>
            </div>

            <div className="text-sm text-white/70">
              {restaurants.length} restaurant{restaurants.length !== 1 ? "s" : ""} found
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <Card className="glassmorphism border-white/20 p-8 text-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">Discovering restaurants...</h3>
              <p className="text-white/70">Finding the best places near you</p>
            </Card>
          )}

          {/* Content */}
          {!isLoading && restaurants.length > 0 && (
            <div className="max-w-6xl mx-auto">
              {viewMode === "map" ? (
                <div className="h-[600px] rounded-lg overflow-hidden">
                  <InteractiveMap
                    restaurants={restaurants}
                    userLocation={userLocation}
                    onRestaurantSelect={handleRestaurantSelect}
                    selectedRestaurant={selectedRestaurant}
                  />
                </div>
              ) : (
                <div className="h-[600px] overflow-y-auto">
                  <RestaurantList
                    restaurants={restaurants}
                    onRestaurantSelect={handleRestaurantSelect}
                    userLocation={userLocation}
                  />
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && restaurants.length === 0 && (
            <Card className="glassmorphism border-white/20 p-8 text-center">
              <div className="text-white/50 mb-4">
                <Map className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-white font-medium mb-2">No restaurants found</h3>
              <p className="text-white/70">Try enabling location access or check back later</p>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
