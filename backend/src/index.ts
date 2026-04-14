import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// ✅ Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ⚠️ OPTIONAL (only for local dev)
// You can keep this, but it's safe to remove in production
dotenv.config({ path: path.join(__dirname, "../.env") })

import { loadEnv } from "./config/env.js"
import { connectMongo } from "./db/mongo.js"
import { createApp } from "./http/app.js"

const env = loadEnv(process.env)

async function main() {
  try {
    // DB is mandatory: server should start only after successful connection.
    await connectMongo(env)

    const app = createApp(env)

    const PORT = env.PORT

    app
      .listen(PORT, () => {
      console.log(`[backend] Server running on port ${PORT}`)
    }).on("error", (err: any) => {
      if (err?.code === "EADDRINUSE") {
        console.error(`[backend] port ${PORT} is already in use`)
        process.exit(1)
      }
      console.error("[backend] server error", err)
      process.exit(1)
      })

  } catch (err) {
    console.error("[backend] fatal startup error", err)
    process.exit(1)
  }
}

main()