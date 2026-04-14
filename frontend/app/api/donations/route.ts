import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import Razorpay from "razorpay"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { restaurantId, amount, isAnonymous, message, paymentMethod } = body

    // ✅ Validation
    if (!amount || amount < 5) {
      return NextResponse.json({ error: "Minimum donation amount is $5" }, { status: 400 })
    }

    if (!paymentMethod || !["card", "upi"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 })
    }

    // ✅ Rewards logic
    const tokens = Math.floor(amount / 5)
    const scratchCards = Math.floor(amount / 10)

    let paymentResult: any = null

    try {
      // 💳 CARD → STRIPE
      if (paymentMethod === "card") {
        if (!process.env.STRIPE_SECRET) {
          return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 })
        }
        const stripe = new Stripe(process.env.STRIPE_SECRET, {
          apiVersion: "2023-10-16" as any,
        })
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100,
          currency: "usd",
          metadata: {
            restaurantId,
            isAnonymous: isAnonymous.toString(),
            message: message || "",
          },
        })

        paymentResult = { paymentIntentId: paymentIntent.id }
      }

      // 📱 UPI → RAZORPAY
      if (paymentMethod === "upi") {
        if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
          return NextResponse.json({ error: "Razorpay is not configured" }, { status: 500 })
        }
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY,
          key_secret: process.env.RAZORPAY_SECRET,
        })
        const order = await razorpay.orders.create({
          amount: amount * 100,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        })

        paymentResult = { orderId: order.id }
      }
    } catch (paymentError) {
      console.error("Payment error:", paymentError)
      return NextResponse.json({ error: "Payment processing failed" }, { status: 402 })
    }

    // ✅ Donation object
    const donation = {
      id: `donation_${Date.now()}`,
      restaurantId,
      amount,
      tokens,
      scratchCards,
      isAnonymous,
      message,
      paymentMethod,
      status: "completed",

      // ✅ IMPORTANT FIX (no hydration error)
      timestamp: new Date().toISOString(),

      ...paymentResult,
    }

    return NextResponse.json({
      success: true,
      donation,
      message: "Donation processed successfully",
    })
  } catch (error) {
    console.error("Donation error:", error)
    return NextResponse.json({ error: "Failed to process donation" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const mockDonations = [
      {
        id: "donation_1",
        restaurantName: "Annapurna Restaurant",
        amount: 25,
        tokens: 5,
        scratchCards: 2,
        isAnonymous: false,

        // ✅ FIXED
        timestamp: new Date(Date.now() - 86400000).toISOString(),

        status: "completed",
      },
      {
        id: "donation_2",
        restaurantName: "Sai Krishna Tiffins",
        amount: 15,
        tokens: 3,
        scratchCards: 1,
        isAnonymous: true,

        // ✅ FIXED
        timestamp: new Date(Date.now() - 172800000).toISOString(),

        status: "completed",
      },
    ]

    return NextResponse.json({
      success: true,
      donations: mockDonations,
    })
  } catch (error) {
    console.error("Fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 })
  }
}