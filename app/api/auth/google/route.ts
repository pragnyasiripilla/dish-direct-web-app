import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const googleAuthUrl =
      `https://accounts.google.com/oauth/authorize?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/google/callback")}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent("openid email profile")}&` +
      `access_type=offline&` +
      `prompt=select_account` // This forces account selection

    console.log("[v0] Redirecting to Google OAuth:", googleAuthUrl)
    return NextResponse.redirect(googleAuthUrl)
  } catch (error) {
    console.error("[v0] Google OAuth error:", error)
    return NextResponse.json({ error: "Google OAuth failed" }, { status: 500 })
  }
}
