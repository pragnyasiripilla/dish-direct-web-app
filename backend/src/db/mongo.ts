import mongoose from "mongoose"
import type { Env } from "../config/env.js"

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1500

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

export async function connectMongo(env: Env) {
  if (!env.MONGODB_URI) {
    console.warn("[backend] MONGODB_URI is missing")
    throw new Error("MONGODB_URI is required")
  }

  const uri = env.MONGODB_URI.trim()
  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    console.warn("[backend] MONGODB_URI format looks invalid; expected mongodb:// or mongodb+srv://")
  }

  let lastError: unknown
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      console.log(`[backend] MongoDB connection attempt ${attempt}/${MAX_RETRIES}`)
      await mongoose.connect(uri)
      console.log("[backend] MongoDB connected")
      return
    } catch (error) {
      lastError = error
      const message = getErrorMessage(error)
      console.error(`[backend] MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES}): ${message}`)

      if (uri.startsWith("mongodb+srv://") && /querySrv|ENOTFOUND|ECONNREFUSED/i.test(message)) {
        console.warn("[backend] DNS/SRV lookup failed. Consider using mongodb:// fallback URI if available.")
      }

      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS)
      }
    }
  }

  throw new Error(`MongoDB connection failed after ${MAX_RETRIES} attempts: ${getErrorMessage(lastError)}`)
}