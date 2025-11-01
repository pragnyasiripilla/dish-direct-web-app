// Restaurant discovery service with Overpass API and fallback data

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

// Fallback restaurant data for Vizianagaram
const VIZIANAGARAM_RESTAURANTS: Restaurant[] = [
  {
    id: "viz-1",
    name: "Annapurna Restaurant",
    lat: 18.1124,
    lng: 83.3956,
    address: "Main Road, Vizianagaram",
    cuisine: "South Indian",
    rating: 4.2,
    verified: true,
    phone: "+91 8942 123456",
    openHours: "6:00 AM - 10:00 PM",
    donationsReceived: 156,
    tokensAvailable: 45,
  },
  {
    id: "viz-2",
    name: "Sai Krishna Tiffins",
    lat: 18.1089,
    lng: 83.3912,
    address: "Station Road, Vizianagaram",
    cuisine: "South Indian",
    rating: 4.0,
    verified: true,
    phone: "+91 8942 234567",
    openHours: "5:30 AM - 11:00 AM",
    donationsReceived: 89,
    tokensAvailable: 23,
  },
  {
    id: "viz-3",
    name: "Hotel Rajdhani",
    lat: 18.1156,
    lng: 83.3978,
    address: "Clock Tower, Vizianagaram",
    cuisine: "North Indian",
    rating: 3.8,
    verified: false,
    phone: "+91 8942 345678",
    openHours: "11:00 AM - 11:00 PM",
    donationsReceived: 67,
    tokensAvailable: 18,
  },
  {
    id: "viz-4",
    name: "Bawarchi Biryani",
    lat: 18.1067,
    lng: 83.3889,
    address: "Cantonment, Vizianagaram",
    cuisine: "Biryani",
    rating: 4.5,
    verified: true,
    phone: "+91 8942 456789",
    openHours: "12:00 PM - 10:00 PM",
    donationsReceived: 234,
    tokensAvailable: 67,
  },
  {
    id: "viz-5",
    name: "Cafe Coffee Day",
    lat: 18.1134,
    lng: 83.3967,
    address: "RTC Complex, Vizianagaram",
    cuisine: "Cafe",
    rating: 3.9,
    verified: true,
    phone: "+91 8942 567890",
    openHours: "8:00 AM - 11:00 PM",
    donationsReceived: 45,
    tokensAvailable: 12,
  },
  {
    id: "viz-6",
    name: "Dosa Point",
    lat: 18.1098,
    lng: 83.3934,
    address: "Bus Stand Road, Vizianagaram",
    cuisine: "South Indian",
    rating: 4.1,
    verified: false,
    phone: "+91 8942 678901",
    openHours: "6:00 AM - 9:00 PM",
    donationsReceived: 78,
    tokensAvailable: 29,
  },
]

// Calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Fetch restaurants from Overpass API
async function fetchFromOverpassAPI(lat: number, lng: number, radiusKm = 10): Promise<Restaurant[]> {
  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["amenity"="restaurant"](around:${radiusKm * 1000},${lat},${lng});
      way["amenity"="restaurant"](around:${radiusKm * 1000},${lat},${lng});
      relation["amenity"="restaurant"](around:${radiusKm * 1000},${lat},${lng});
    );
    out center meta;
  `

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    })

    if (!response.ok) {
      throw new Error("Overpass API request failed")
    }

    const data = await response.json()

    return data.elements
      .map((element: any) => {
        const elementLat = element.lat || element.center?.lat
        const elementLng = element.lon || element.center?.lon

        if (!elementLat || !elementLng) return null

        const distance = calculateDistance(lat, lng, elementLat, elementLng)

        let address = "Address not available"
        if (element.tags) {
          const addressParts = []
          if (element.tags["addr:housenumber"]) addressParts.push(element.tags["addr:housenumber"])
          if (element.tags["addr:street"]) addressParts.push(element.tags["addr:street"])
          if (element.tags["addr:suburb"]) addressParts.push(element.tags["addr:suburb"])
          if (element.tags["addr:city"]) addressParts.push(element.tags["addr:city"])
          if (element.tags["addr:state"]) addressParts.push(element.tags["addr:state"])

          if (addressParts.length > 0) {
            address = addressParts.join(", ")
          } else if (element.tags["addr:full"]) {
            address = element.tags["addr:full"]
          } else if (element.tags["addr:street"]) {
            address = element.tags["addr:street"]
          }
        }

        return {
          id: `osm-${element.id}`,
          name: element.tags?.name || "Unknown Restaurant",
          lat: elementLat,
          lng: elementLng,
          address,
          cuisine: element.tags?.cuisine || "Restaurant",
          rating: Math.random() * 2 + 3, // Random rating between 3-5
          verified: Math.random() > 0.7, // 30% chance of being verified
          phone: element.tags?.phone,
          openHours: element.tags?.opening_hours,
          donationsReceived: Math.floor(Math.random() * 200),
          tokensAvailable: Math.floor(Math.random() * 50),
          distance,
        }
      })
      .filter(Boolean)
      .filter((restaurant: Restaurant) => restaurant.distance <= radiusKm)
      .sort((a: Restaurant, b: Restaurant) => (a.distance || 0) - (b.distance || 0))
  } catch (error) {
    console.error("Overpass API error:", error)
    throw error
  }
}

// Main function to discover restaurants
export async function discoverRestaurants(
  userLocation?: { lat: number; lng: number },
  radiusKm = 10,
  searchLocation?: string,
): Promise<Restaurant[]> {
  // If search location is provided, geocode it first
  if (searchLocation && !userLocation) {
    try {
      const geocodedLocation = await geocodeLocation(searchLocation)
      if (geocodedLocation) {
        userLocation = geocodedLocation
      }
    } catch (error) {
      console.error("[v0] Geocoding error:", error)
    }
  }

  // If no user location, return Vizianagaram fallback data
  if (!userLocation) {
    return VIZIANAGARAM_RESTAURANTS.map((restaurant) => ({
      ...restaurant,
      distance: 0,
    }))
  }

  try {
    // Try Overpass API first
    const restaurants = await fetchFromOverpassAPI(userLocation.lat, userLocation.lng, radiusKm)

    // If we get results, return them
    if (restaurants.length > 0) {
      return restaurants
    }

    // If no results from Overpass, fall back to Vizianagaram data with calculated distances
    return VIZIANAGARAM_RESTAURANTS.map((restaurant) => ({
      ...restaurant,
      distance: calculateDistance(userLocation.lat, userLocation.lng, restaurant.lat, restaurant.lng),
    })).filter((restaurant) => restaurant.distance <= radiusKm)
  } catch (error) {
    console.error("Restaurant discovery error:", error)

    // On error, fall back to Vizianagaram data
    return VIZIANAGARAM_RESTAURANTS.map((restaurant) => ({
      ...restaurant,
      distance: userLocation
        ? calculateDistance(userLocation.lat, userLocation.lng, restaurant.lat, restaurant.lng)
        : 0,
    })).filter((restaurant) => !userLocation || restaurant.distance <= radiusKm)
  }
}

async function geocodeLocation(location: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`,
    )

    if (!response.ok) {
      throw new Error("Geocoding request failed")
    }

    const data = await response.json()

    if (data.length > 0) {
      return {
        lat: Number.parseFloat(data[0].lat),
        lng: Number.parseFloat(data[0].lon),
      }
    }

    return null
  } catch (error) {
    console.error("[v0] Geocoding error:", error)
    return null
  }
}
