import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const otpStore = new Map<string, { otp: string; expires: number }>()

export async function POST(request: NextRequest) {
  try {
    const { email, password, phone, name, role, otp } = await request.json()

    console.log("[v0] Registration attempt:", { email, phone, name, role, hasOtp: !!otp })

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (otp) {
      const phoneData = otpStore.get(phone)
      const emailData = otpStore.get(email)

      console.log("[v0] OTP verification:", {
        hasPhoneData: !!phoneData,
        hasEmailData: !!emailData,
        providedOtp: otp,
      })

      if (!phoneData && !emailData) {
        return NextResponse.json({ error: "OTP not found or expired" }, { status: 400 })
      }

      const isPhoneValid = phoneData && phoneData.otp === otp && phoneData.expires > Date.now()
      const isEmailValid = emailData && emailData.otp === otp && emailData.expires > Date.now()

      if (!isPhoneValid && !isEmailValid) {
        return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
      }

      // Clean up used OTP
      otpStore.delete(phone)
      otpStore.delete(email)
      console.log("[v0] OTP verified successfully")
    }

    // Check if user already exists (mock implementation)
    const existingUser = null // In real app: await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    let hashedPassword: string
    try {
      hashedPassword = await bcrypt.hash(password, 12)
    } catch (bcryptError) {
      console.error("[v0] Bcrypt error:", bcryptError)
      return NextResponse.json({ error: "Password encryption failed" }, { status: 500 })
    }

    const newUser = {
      _id: Math.random().toString(36).substr(2, 9),
      email,
      password: hashedPassword,
      phone,
      name,
      role,
      tokens: 0,
      scratchCards: [],
      badges: [],
      totalDonated: 0,
      donationCount: 0,
      level: 1,
      experience: 0,
      isVerified: !!otp, // Verified if OTP was provided
      provider: "email",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log("[v0] User created:", { id: newUser._id, email: newUser.email, isVerified: newUser.isVerified })

    let token: string
    try {
      const jwtSecret = process.env.JWT_SECRET || "fallback-secret-key-for-development"
      token = jwt.sign({ userId: newUser._id, email: newUser.email, role: newUser.role }, jwtSecret, {
        expiresIn: "7d",
      })
    } catch (jwtError) {
      console.error("[v0] JWT error:", jwtError)
      return NextResponse.json({ error: "Token generation failed" }, { status: 500 })
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      message: "User registered successfully",
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json(
      {
        error: "Registration failed. Please try again.",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    )
  }
}
