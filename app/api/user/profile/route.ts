import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Mock user profile data
    const mockUser = {
      _id: userId,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+91 9876543210",
      role: "user",
      profilePicture: "/diverse-user-avatars.png",
      location: {
        latitude: 18.1167,
        longitude: 83.4167,
        address: "Vizianagaram, Andhra Pradesh",
      },
      tokens: 75,
      scratchCards: ["card1", "card2", "card3"],
      badges: ["first_donation", "generous_donor", "community_supporter"],
      totalDonated: 500,
      donationCount: 10,
      level: 3,
      experience: 250,
      isVerified: true,
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date(),
    }

    return NextResponse.json({
      user: mockUser,
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, name, phone, location } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Mock profile update
    const updatedUser = {
      _id: userId,
      name: name || "John Doe",
      phone: phone || "+91 9876543210",
      location: location || {
        latitude: 18.1167,
        longitude: 83.4167,
        address: "Vizianagaram, Andhra Pradesh",
      },
      updatedAt: new Date(),
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
