"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Search, MapPin, Loader2 } from "lucide-react"

interface LocationSearchProps {
  onLocationSelect: (location: { lat: number; lng: number; name: string }) => void
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])

  const searchLocation = async (query: string) => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
      )
      const data = await response.json()
      setSuggestions(data)
    } catch (error) {
      console.error("[v0] Location search error:", error)
    }
    setIsSearching(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchLocation(searchTerm)
  }

  const selectLocation = (location: any) => {
    onLocationSelect({
      lat: Number.parseFloat(location.lat),
      lng: Number.parseFloat(location.lon),
      name: location.display_name,
    })
    setSuggestions([])
    setSearchTerm("")
  }

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
          <Input
            placeholder="Search any location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-primary"
          />
        </div>
        <Button type="submit" disabled={isSearching || !searchTerm.trim()} className="bg-primary hover:bg-primary/90">
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </Button>
      </form>

      {suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 glassmorphism border-white/20 p-2 z-50">
          {suggestions.map((location, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start text-left p-3 text-white hover:bg-white/10"
              onClick={() => selectLocation(location)}
            >
              <MapPin className="w-4 h-4 mr-2 text-primary" />
              <div>
                <div className="font-medium">{location.display_name.split(",")[0]}</div>
                <div className="text-sm text-white/60">{location.display_name}</div>
              </div>
            </Button>
          ))}
        </Card>
      )}
    </div>
  )
}
