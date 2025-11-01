import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Mock scratch cards data
    const mockScratchCards = [
      {
        _id: "card1",
        userId,
        type: "rare",
        reward: {
          type: "discount",
          value: 20,
          restaurantId: "rest1",
        },
        isScratched: false,
        isRedeemed: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        createdAt: new Date(),
      },
      {
        _id: "card2",
        userId,
        type: "common",
        reward: {
          type: "tokens",
          value: 10,
        },
        isScratched: true,
        isRedeemed: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
      {
        _id: "card3",
        userId,
        type: "epic",
        reward: {
          type: "free_meal",
          value: "Free Biryani",
          restaurantId: "rest2",
        },
        isScratched: false,
        isRedeemed: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      },
    ]

    return NextResponse.json({
      scratchCards: mockScratchCards,
      total: mockScratchCards.length,
    })
  } catch (error) {
    console.error("Error fetching scratch cards:", error)
    return NextResponse.json({ error: "Failed to fetch scratch cards" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { cardId, userId } = await request.json()

    if (!cardId || !userId) {
      return NextResponse.json({ error: "Card ID and User ID are required" }, { status: 400 })
    }

    // Mock scratch card reveal
    const revealedCard = {
      _id: cardId,
      userId,
      type: "rare",
      reward: {
        type: "discount",
        value: 25,
        restaurantId: "rest1",
      },
      isScratched: true,
      isRedeemed: false,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    }

    return NextResponse.json({
      message: "Scratch card revealed successfully",
      scratchCard: revealedCard,
    })
  } catch (error) {
    console.error("Error revealing scratch card:", error)
    return NextResponse.json({ error: "Failed to reveal scratch card" }, { status: 500 })
  }
}
