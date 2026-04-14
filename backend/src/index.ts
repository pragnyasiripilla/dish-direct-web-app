import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// ✅ Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ✅ Load .env correctly from backend folder
dotenv.config({ path: path.join(__dirname, "../.env") })

import { loadEnv } from "./config/env.js"
import { connectMongo } from "./db/mongo.js"
import { createApp } from "./http/app.js"

// ✅ Debug (check if env is loading)
console.log("SMTP_HOST:", process.env.SMTP_HOST)

const env = loadEnv(process.env)

async function main() {
  if (env.MONGODB_URI) {
    await connectMongo(env)
  } else {
    console.warn("[backend] MONGODB_URI not set; starting without database connection")
  }

  const app = createApp(env)

  app.listen(env.PORT, () => {
    console.log(`[backend] listening on http://localhost:${env.PORT}`)
  }).on("error", (err: any) => {
    if (err?.code === "EADDRINUSE") {
      console.error(`[backend] port ${env.PORT} is already in use`)
      process.exit(1)
    }
    console.error("[backend] server error", err)
    process.exit(1)
  })
}

main().catch((err) => {
  console.error("[backend] fatal startup error", err)
  process.exit(1)
})