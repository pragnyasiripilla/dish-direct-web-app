import dotenv from "dotenv"
dotenv.config()

import { loadEnv } from "./config/env.js"
import { connectMongo } from "./db/mongo.js"
import { createApp } from "./http/app.js"

const env = loadEnv(process.env)

async function main() {
  if (env.MONGODB_URI) {
    await connectMongo(env)
  } else {
    console.warn("[backend] MONGODB_URI not set; starting without database connection")
  }

  const app = createApp(env)
  const startOnPort = (port: number) =>
    new Promise<void>((resolve) => {
      const server = app.listen(port, () => {
        console.log(`[backend] listening on http://localhost:${port}`)
        resolve()
      })
      server.on("error", (err: any) => {
        if (err?.code === "EADDRINUSE") {
          console.warn(`[backend] port ${port} in use, trying ${port + 1}`)
          server.close(() => startOnPort(port + 1).then(resolve))
          return
        }
        console.error("[backend] server error", err)
        process.exit(1)
      })
    })

  await startOnPort(env.PORT)
}

main().catch((err) => {
  console.error("[backend] fatal startup error", err)
  process.exit(1)
})

