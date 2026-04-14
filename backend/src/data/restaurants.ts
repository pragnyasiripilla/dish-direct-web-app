export interface RestaurantItem {
  id: string
  name: string
  lat: number
  lng: number
  address: string
  cuisine: string
  rating: number
  verified: boolean
  donationsReceived: number
  tokensAvailable: number
}

export const RESTAURANTS: RestaurantItem[] = [
  {
    id: "viz-1",
    name: "Annapurna Restaurant",
    lat: 18.1124,
    lng: 83.3956,
    address: "Main Road, Vizianagaram",
    cuisine: "South Indian",
    rating: 4.2,
    verified: true,
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
    donationsReceived: 234,
    tokensAvailable: 67,
  },
]
