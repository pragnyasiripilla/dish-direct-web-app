import mongoose from "mongoose"

export async function connectMongo(env: any) {
  try {
    await mongoose.connect(env.MONGODB_URI)
    console.log("✅ Connected to MongoDB")
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error)
  }
}