import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Otp } from "../../models/Otp.js"
import { User } from "../../models/User.js"
import { sendEmail } from "../../utils/sendEmail.js"

const router = Router()

function issueToken(userId: string) {
  const secret = process.env.JWT_SECRET || "dev_secret_change_me"
  return jwt.sign({ userId }, secret as jwt.Secret, { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any })
}

function readBearerToken(authHeader?: string) {
  if (!authHeader) return null
  const [scheme, token] = authHeader.split(" ")
  if (scheme !== "Bearer" || !token) return null
  return token
}

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body as { email?: string }
    if (!email) return res.status(400).json({ success: false, message: "Email is required" })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await Otp.deleteMany({ email })
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    })

    try {
      const emailResult = await sendEmail(email, otp)
      if (!emailResult.success) {
        return res.status(500).json({
          success: false,
          message: "Failed to send OTP. Please try again.",
        })
      }
    } catch (emailError) {
      console.error("send-otp email error:", emailError)
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again.",
      })
    }

    return res.json({
      success: true,
      message: "OTP sent successfully",
    })
  } catch (error) {
    console.error("send-otp failed", error)
    return res.status(500).json({ success: false, message: "Failed to send OTP. Please try again." })
  }
})

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, otp, role } = req.body as {
      name?: string
      email?: string
      password?: string
      otp?: string
      role?: "user" | "restaurant" | "admin"
    }

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ message: "Name, email, password and OTP are required" })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(409).json({ message: "User already exists" })

    const otpRecord = await Otp.findOne({ email, otp })
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role || "user",
    })
    await Otp.deleteMany({ email })

    const token = issueToken(user._id.toString())
    return res.status(201).json({
      message: "Account created",
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
    })
  } catch (error) {
    console.error("register failed", error)
    return res.status(500).json({ message: "Registration failed" })
  }
})

router.post("/login-otp/request", async (req, res) => {
  try {
    const { email } = req.body as { email?: string }
    if (!email) return res.status(400).json({ message: "Email is required" })

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: "User not found" })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await Otp.deleteMany({ email })
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    })
    await sendEmail(email, otp)
    return res.json({ message: "OTP sent for login" })
  } catch (error) {
    console.error("login otp request failed", error)
    return res.status(500).json({ message: "Failed to send login OTP" })
  }
})

router.post("/login-otp/verify", async (req, res) => {
  try {
    const { email, otp } = req.body as { email?: string; otp?: string }
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" })

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: "User not found" })

    const record = await Otp.findOne({ email, otp })
    if (!record || record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" })
    }

    await Otp.deleteMany({ email })
    const token = issueToken(user._id.toString())
    return res.json({
      message: "Logged in successfully",
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
    })
  } catch (error) {
    console.error("verify login otp failed", error)
    return res.status(500).json({ message: "Login failed" })
  }
})

router.post("/login-password", async (req, res) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string }
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" })

    const user = await User.findOne({ email })
    if (!user?.passwordHash) return res.status(401).json({ message: "Invalid credentials" })
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ message: "Invalid credentials" })

    const token = issueToken(user._id.toString())
    return res.json({
      message: "Logged in successfully",
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
    })
  } catch (error) {
    console.error("password login failed", error)
    return res.status(500).json({ message: "Login failed" })
  }
})

router.get("/me", async (req, res) => {
  try {
    const token = readBearerToken(req.headers.authorization)
    if (!token) return res.status(401).json({ message: "Unauthorized" })

    const secret = process.env.JWT_SECRET || "dev_secret_change_me"
    const decoded = jwt.verify(token, secret as jwt.Secret) as { userId?: string }
    if (!decoded?.userId) return res.status(401).json({ message: "Unauthorized" })

    const user = await User.findById(decoded.userId)
    if (!user) return res.status(404).json({ message: "User not found" })

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        donationCount: user.donationCount,
        totalDonated: user.totalDonated,
        mealsShared: user.mealsShared,
        points: user.points,
        badges: user.badges,
      },
    })
  } catch (error) {
    console.error("auth me failed", error)
    return res.status(401).json({ message: "Unauthorized" })
  }
})

router.get("/google/url", async (_req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const callback = process.env.GOOGLE_CALLBACK_URL
  if (!clientId || !callback) return res.status(500).json({ message: "Google OAuth not configured" })

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callback,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  })

  return res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` })
})

export default router