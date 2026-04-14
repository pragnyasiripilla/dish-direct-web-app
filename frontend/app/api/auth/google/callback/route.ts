import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const error = searchParams.get("error")

    console.log("[v0] Google OAuth callback - Code:", code, "Error:", error)

    if (error || !code) {
      console.log("[v0] OAuth error or no code:", error)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/sign-in?error=oauth_failed`)
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/google/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      console.log("[v0] Token exchange failed:", await tokenResponse.text())
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/sign-in?error=token_exchange_failed`)
    }

    const tokens = await tokenResponse.json()
    console.log("[v0] Tokens received:", !!tokens.access_token)

    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!userResponse.ok) {
      console.log("[v0] User info fetch failed")
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/sign-in?error=user_info_failed`)
    }

    const googleUser = await userResponse.json()
    console.log("[v0] Google user info:", googleUser.email, googleUser.name)

    const user = {
      id: "google_" + googleUser.id,
      name: googleUser.name,
      email: googleUser.email,
      role: "user",
      isVerified: true,
      provider: "google",
    }

    const token = jwt.sign(user, process.env.JWT_SECRET || "secret", { expiresIn: "7d" })

    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`)
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    console.log("[v0] Google OAuth successful, redirecting to dashboard")
    return response
  } catch (error) {
    console.error("[v0] Google OAuth callback error:", error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/sign-in?error=oauth_failed`)
  }
}
