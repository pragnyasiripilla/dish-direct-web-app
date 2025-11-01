import { type NextRequest, NextResponse } from "next/server"

const otpStore = new Map<string, { otp: string; expires: number }>()

export async function POST(request: NextRequest) {
  try {
    const { phone, email } = await request.json()

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 }) // 5 minutes
    otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 })

    console.log(`[v0] OTP for ${phone}/${email}: ${otp}`) // For development

    console.log(`[v0] Simulating SMS to ${phone}: "Your DishDirect verification code is: ${otp}"`)
    console.log(`[v0] Simulating Email to ${email}: "Your DishDirect verification code is: ${otp}"`)

    console.log(`[v0] 📱 MOCK SMS: ${phone} - Code: ${otp}`)
    console.log(`[v0] 📧 MOCK EMAIL: ${email} - Code: ${otp}`)

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      ...(process.env.NODE_ENV === "development" && { otp }),
    })
  } catch (error) {
    console.error("[v0] OTP sending error:", error)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { phone, email, otp } = await request.json()

    const phoneData = otpStore.get(phone)
    const emailData = otpStore.get(email)

    if (!phoneData && !emailData) {
      return NextResponse.json({ error: "OTP not found or expired" }, { status: 400 })
    }

    const isPhoneValid = phoneData && phoneData.otp === otp && phoneData.expires > Date.now()
    const isEmailValid = emailData && emailData.otp === otp && emailData.expires > Date.now()

    if (isPhoneValid || isEmailValid) {
      // Clean up used OTP
      otpStore.delete(phone)
      otpStore.delete(email)
      return NextResponse.json({ success: true, message: "OTP verified successfully" })
    } else {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] OTP verification error:", error)
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
  }
}
