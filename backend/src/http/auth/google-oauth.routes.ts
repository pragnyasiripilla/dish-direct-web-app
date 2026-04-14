import { Router } from "express"
import jwt from "jsonwebtoken"
import passport from "passport"
import { Strategy as GoogleStrategy, type Profile, type VerifyCallback } from "passport-google-oauth20"
import { User } from "../../models/User.js"

const router = Router()

function issueToken(userId: string) {
  const secret = process.env.JWT_SECRET || "dev_secret_change_me"
  return jwt.sign({ userId }, secret as jwt.Secret, { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any })
}

let strategyConfigured = false

export function configureGoogleStrategy() {
  if (strategyConfigured) return

  const clientID = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const callbackURL = process.env.GOOGLE_CALLBACK_URL

  console.log("GOOGLE_CALLBACK_URL:", callbackURL)
  if (!clientID || !clientSecret || !callbackURL) {
    console.warn("[auth] Google strategy not configured. Missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET/GOOGLE_CALLBACK_URL")
    return
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID,
        clientSecret,
        callbackURL,
      },
      async (_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
          const email = profile.emails?.[0]?.value
          if (!email) {
            return done(new Error("Google profile missing email"))
          }

          let user = await User.findOne({ email })
          if (!user) {
            user = await User.create({
              name: profile.displayName || email.split("@")[0],
              email,
              googleId: profile.id,
              role: "user",
            })
          } else if (!user.googleId) {
            user.googleId = profile.id
            await user.save()
          }

          return done(null, user)
        } catch (error) {
          return done(error as Error)
        }
      },
    ),
  )

  strategyConfigured = true
  console.log(`[auth] Google strategy configured with callback ${callbackURL}`)
}

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }))

router.get("/auth/google/callback", (req, res, next) => {
  const frontendBase = process.env.FRONTEND_URL || "http://localhost:3000"
  passport.authenticate("google", { session: false }, (err: unknown, user: any) => {
    if (err) {
      console.error("[auth] Google callback passport error", err)
      return res.redirect(`${frontendBase}`)
    }

    if (!user) {
      console.error("[auth] Google callback failed: no user returned")
      return res.redirect(`${frontendBase}`)
    }

    const token = issueToken(user._id.toString())
    const redirectUrl = new URL("/auth/callback", frontendBase)
    redirectUrl.searchParams.set("token", token)
    redirectUrl.searchParams.set("id", user._id.toString())
    redirectUrl.searchParams.set("email", user.email)
    redirectUrl.searchParams.set("name", user.name)
    redirectUrl.searchParams.set("role", user.role)

    console.log(`[auth] Google callback success for ${user.email}`)
    return res.redirect(redirectUrl.toString())
  })(req, res, next)
})

export default router
