import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "all-time"

    // Mock leaderboard data
    const mockLeaderboard = [
      {
        _id: "user1",
        name: "Arjun Patel",
        totalDonated: 2500,
        donationCount: 50,
        level: 8,
        badges: ["generous_donor", "community_hero", "streak_master"],
        profilePicture: "/diverse-user-avatars.png",
      },
      {
        _id: "user2",
        name: "Priya Sharma",
        totalDonated: 1800,
        donationCount: 36,
        level: 6,
        badges: ["first_donation", "generous_donor", "local_hero"],
        profilePicture: "/diverse-user-avatars.png",
      },
      {
        _id: "user3",
        name: "Rajesh Kumar",
        totalDonated: 1500,
        donationCount: 30,
        level: 5,
        badges: ["first_donation", "generous_donor"],
        profilePicture: "/diverse-user-avatars.png",
      },
      {
        _id: "user4",
        name: "Sneha Reddy",
        totalDonated: 1200,
        donationCount: 24,
        level: 4,
        badges: ["first_donation", "community_supporter"],
        profilePicture: "/diverse-user-avatars.png",
      },
      {
        _id: "user5",
        name: "Vikram Singh",
        totalDonated: 1000,
        donationCount: 20,
        level: 4,
        badges: ["first_donation", "generous_donor"],
        profilePicture: "/diverse-user-avatars.png",
      },
    ]

    return NextResponse.json({
      leaderboard: mockLeaderboard,
      period,
      total: mockLeaderboard.length,
    })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}
