import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import passport from "passport"
import type { Env } from "../config/env.js"

import authRoutes from "./auth/auth.routes.js"
import googleOAuthRoutes, { configureGoogleStrategy } from "./auth/google-oauth.routes.js"
import donationsRoutes from "./donations/donations.routes.js"
import rewardsRoutes from "./rewards/rewards.routes.js"
import restaurantsRoutes from "./restaurants/restaurants.routes.js"
import communityRoutes from "./community/community.routes.js"

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
  app.use(passport.initialize())
  configureGoogleStrategy()

  app.use(
    rateLimit({
      windowMs: 60_000,
      limit: 300,
      standardHeaders: "draft-7",
      legacyHeaders: false,
    }),
  )

  app.use("/", googleOAuthRoutes)
  app.use("/auth", authRoutes)
  app.use("/donations", donationsRoutes)
  app.use("/rewards", rewardsRoutes)
  app.use("/restaurants", restaurantsRoutes)
  app.use("/community", communityRoutes)

  console.log("[routes] Registered: GET /auth/google")
  console.log("[routes] Registered: GET /auth/google/callback")
  console.log("[routes] Registered prefix: /auth, /donations, /rewards, /restaurants, /community")

  app.get("/health", (_req, res) => {
    res.json({ ok: true })
  })

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("[backend] unhandled error", err)
    res.status(500).json({ error: "Internal server error" })
  })

  return app
}