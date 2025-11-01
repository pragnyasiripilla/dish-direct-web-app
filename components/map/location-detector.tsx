"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Navigation, AlertCircle, Loader2 } from "lucide-react"

interface LocationDetectorProps {
  onLocationDetected: (location: { lat: number; lng: number }) => void
  onLocationError: (error: string) => void
}

export function LocationDetector({ onLocationDetected, onLocationError }: LocationDetectorProps) {
  const [isDetecting, setIsDetecting] = useState(false)
  const [locationStatus, setLocationStatus] = useState<"idle" | "detecting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const detectLocation = () => {
    if (!navigator.geolocation) {
      const error = "Geolocation is not supported by this browser"
      setErrorMessage(error)
      setLocationStatus("error")
      onLocationError(error)
      return
    }

    setIsDetecting(true)
    setLocationStatus("detecting")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setLocationStatus("success")
        setIsDetecting(false)
        onLocationDetected(location)
      },
      (error) => {
        let errorMsg = "Unable to detect location"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Location access denied by user"
            break
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Location information unavailable"
            break
          case error.TIMEOUT:
            errorMsg = "Location request timed out"
            break
        }
        setErrorMessage(errorMsg)
        setLocationStatus("error")
        setIsDetecting(false)
        onLocationError(errorMsg)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  // Auto-detect location on component mount
  useEffect(() => {
    detectLocation()
  }, [])

  return (
    <Card className="glassmorphism border-white/20 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            {isDetecting ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : locationStatus === "success" ? (
              <Navigation className="w-5 h-5 text-white" />
            ) : (
              <MapPin className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-white font-medium">
              {locationStatus === "detecting"
                ? "Detecting your location..."
                : locationStatus === "success"
                  ? "Location detected"
                  : locationStatus === "error"
                    ? "Location detection failed"
                    : "Detect your location"}
            </h3>
            <p className="text-sm text-white/70">
              {locationStatus === "detecting"
                ? "Please allow location access"
                : locationStatus === "success"
                  ? "Finding nearby restaurants"
                  : locationStatus === "error"
                    ? errorMessage
                    : "Find restaurants within 10km"}
            </p>
          </div>
        </div>

        {locationStatus === "error" && (
          <Button
            onClick={detectLocation}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isDetecting}
          >
            <Navigation className="w-4 h-4 mr-1" />
            Retry
          </Button>
        )}
      </div>

      {locationStatus === "error" && (
        <div className="mt-3 p-3 bg-destructive/20 border border-destructive/30 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="text-destructive font-medium">Location access required</p>
            <p className="text-destructive/80 mt-1">
              We'll use Vizianagaram restaurants as fallback data. Enable location for personalized results.
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
