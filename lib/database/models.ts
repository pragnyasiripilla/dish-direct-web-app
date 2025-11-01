export interface User {
  _id: string
  email: string
  password?: string
  phone?: string
  name: string
  role: "user" | "restaurant" | "admin"
  profilePicture?: string
  location?: {
    latitude: number
    longitude: number
    address: string
  }
  tokens: number
  scratchCards: string[]
  badges: string[]
  totalDonated: number
  donationCount: number
  level: number
  experience: number
  isVerified: boolean
  googleId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Restaurant {
  _id: string
  name: string
  email: string
  phone: string
  address: string
  location: {
    latitude: number
    longitude: number
  }
  cuisine: string[]
  description: string
  images: string[]
  rating: number
  totalRedemptions: number
  isVerified: boolean
  operatingHours: {
    [key: string]: { open: string; close: string; closed?: boolean }
  }
  createdAt: Date
  updatedAt: Date
}

export interface Donation {
  _id: string
  userId?: string // Optional for anonymous donations
  restaurantId: string
  amount: number
  tokens: number
  scratchCards: number
  isAnonymous: boolean
  paymentIntentId: string
  status: "pending" | "completed" | "failed"
  message?: string
  createdAt: Date
}

export interface ScratchCard {
  _id: string
  userId: string
  type: "common" | "rare" | "epic" | "legendary"
  reward: {
    type: "discount" | "free_meal" | "tokens" | "badge"
    value: number | string
    restaurantId?: string
  }
  isScratched: boolean
  isRedeemed: boolean
  expiresAt: Date
  createdAt: Date
}

export interface Badge {
  _id: string
  name: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  requirements: {
    type: "donations" | "amount" | "streak" | "restaurants"
    value: number
  }
}

export interface Redemption {
  _id: string
  userId: string
  restaurantId: string
  scratchCardId: string
  status: "pending" | "approved" | "rejected"
  redeemedAt: Date
  approvedAt?: Date
}
