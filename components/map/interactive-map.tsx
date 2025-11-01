"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

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

interface InteractiveMapProps {
  restaurants: Restaurant[]
  userLocation?: { lat: number; lng: number }
  onRestaurantSelect?: (restaurant: Restaurant) => void
  selectedRestaurant?: Restaurant | null
}

export function InteractiveMap({
  restaurants,
  userLocation,
  onRestaurantSelect,
  selectedRestaurant,
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapError, setMapError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const initializeMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return

      try {
        setIsLoading(true)
        setMapError(null)

        const L = await import("leaflet")
        await import("leaflet/dist/leaflet.css")

        // Fix default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        })

        if (!mounted) return

        const center = userLocation || { lat: 40.7128, lng: -74.006 } // Default to NYC
        const map = L.map(mapRef.current, {
          center: [center.lat, center.lng],
          zoom: userLocation ? 13 : 10,
          zoomControl: true,
          scrollWheelZoom: true,
        })

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map)

        if (userLocation) {
          const userIcon = L.divIcon({
            html: '<div style="background: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            className: "user-location-marker",
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })

          L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map).bindPopup("Your Location")
        }

        restaurants.forEach((restaurant) => {
          const restaurantIcon = L.divIcon({
            html: `<div style="background: ${restaurant.verified ? "#10b981" : "#f59e0b"}; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            className: "restaurant-marker",
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          })

          const marker = L.marker([restaurant.lat, restaurant.lng], { icon: restaurantIcon })
            .addTo(map)
            .bindPopup(`
              <div style="min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-weight: 600;">${restaurant.name}</h3>
                <p style="margin: 0 0 4px 0; color: #666; font-size: 14px;">${restaurant.cuisine}</p>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">${restaurant.address}</p>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <span style="color: #f59e0b;">★ ${restaurant.rating}</span>
                  ${restaurant.verified ? '<span style="color: #10b981; font-size: 12px;">✓ Verified</span>' : ""}
                </div>
                <button onclick="window.selectRestaurant('${restaurant.id}')" 
                        style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                  View Details
                </button>
              </div>
            `)

          if (selectedRestaurant && selectedRestaurant.id === restaurant.id) {
            marker.openPopup()
          }
        })

        mapInstanceRef.current = map
        ;(window as any).selectRestaurant = (restaurantId: string) => {
          const restaurant = restaurants.find((r) => r.id === restaurantId)
          if (restaurant && onRestaurantSelect) {
            onRestaurantSelect(restaurant)
          }
        }

        if (mounted) {
          setIsLoading(false)
        }
      } catch (error) {
        console.error("[v0] Map initialization error:", error)
        if (mounted) {
          setMapError("Failed to load map. Please try refreshing the page.")
          setIsLoading(false)
        }
      }
    }

    initializeMap()

    return () => {
      mounted = false
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        } catch (error) {
          console.log("[v0] Map cleanup completed")
        }
      }
      // Clean up global function
      if (typeof window !== "undefined") {
        delete (window as any).selectRestaurant
      }
    }
  }, [restaurants, userLocation, selectedRestaurant, onRestaurantSelect])

  if (mapError) {
    return (
      <Card className="w-full h-full flex items-center justify-center bg-slate-800/50 border-white/20">
        <div className="text-center text-white/70">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium mb-2">Map Error</h3>
          <p className="text-sm mb-4">{mapError}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Refresh Page
          </Button>
        </div>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="w-full h-full flex items-center justify-center bg-slate-800/50 border-white/20">
        <div className="text-center text-white/70">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Loading Map</h3>
          <p className="text-sm">Initializing interactive map...</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}
