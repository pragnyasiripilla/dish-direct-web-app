import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import type { Env } from "../config/env.js"

// ✅ ADD THIS
import authRoutes from "./auth/auth.routes.js"

export function createApp(env: Env) {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  )
  app.use(express.json({ limit: "1mb" }))
  app.use(cookieParser())
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"))

  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 300,
      standardHeaders: "draft-7",
      legacyHeaders: false,
    }),
  )

  // ✅ ADD THIS
  app.use("/auth", authRoutes)

  app.get("/health", (_req, res) => {
    res.json({ ok: true })
  })

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("[backend] unhandled error", err)
    res.status(500).json({ error: "Internal server error" })
  })

  return app
}