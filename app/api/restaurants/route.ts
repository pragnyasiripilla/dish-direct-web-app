import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")
    const radius = searchParams.get("radius") || "10"

    // Mock restaurant data for Vizianagaram
    const mockRestaurants = [
      {
        _id: "rest1",
        name: "Spice Garden",
        address: "Main Road, Vizianagaram",
        location: { latitude: 18.1167, longitude: 83.4167 },
        cuisine: ["Indian", "South Indian"],
        description: "Authentic South Indian cuisine",
        images: ["/indian-restaurant-exterior.png"],
        rating: 4.5,
        totalRedemptions: 25,
        isVerified: true,
        operatingHours: {
          monday: { open: "09:00", close: "22:00" },
          tuesday: { open: "09:00", close: "22:00" },
          wednesday: { open: "09:00", close: "22:00" },
          thursday: { open: "09:00", close: "22:00" },
          friday: { open: "09:00", close: "22:00" },
          saturday: { open: "09:00", close: "22:00" },
          sunday: { open: "09:00", close: "22:00" },
        },
      },
      {
        _id: "rest2",
        name: "Royal Biryani House",
        address: "Station Road, Vizianagaram",
        location: { latitude: 18.12, longitude: 83.42 },
        cuisine: ["Indian", "Biryani", "Mughlai"],
        description: "Famous for authentic Hyderabadi biryani",
        images: ["/biryani-restaurant.png"],
        rating: 4.7,
        totalRedemptions: 40,
        isVerified: true,
        operatingHours: {
          monday: { open: "11:00", close: "23:00" },
          tuesday: { open: "11:00", close: "23:00" },
          wednesday: { open: "11:00", close: "23:00" },
          thursday: { open: "11:00", close: "23:00" },
          friday: { open: "11:00", close: "23:00" },
          saturday: { open: "11:00", close: "23:00" },
          sunday: { open: "11:00", close: "23:00" },
        },
      },
      {
        _id: "rest3",
        name: "Coastal Delights",
        address: "Beach Road, Vizianagaram",
        location: { latitude: 18.11, longitude: 83.41 },
        cuisine: ["Seafood", "Coastal", "Indian"],
        description: "Fresh seafood and coastal specialties",
        images: ["/seafood-restaurant.png"],
        rating: 4.3,
        totalRedemptions: 18,
        isVerified: true,
        operatingHours: {
          monday: { open: "12:00", close: "22:00" },
          tuesday: { open: "12:00", close: "22:00" },
          wednesday: { open: "12:00", close: "22:00" },
          thursday: { open: "12:00", close: "22:00" },
          friday: { open: "12:00", close: "23:00" },
          saturday: { open: "12:00", close: "23:00" },
          sunday: { open: "12:00", close: "22:00" },
        },
      },
    ]

    // In a real app, filter by location and radius
    const restaurants = mockRestaurants

    return NextResponse.json({
      restaurants,
      total: restaurants.length,
    })
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    return NextResponse.json({ error: "Failed to fetch restaurants" }, { status: 500 })
  }
}
