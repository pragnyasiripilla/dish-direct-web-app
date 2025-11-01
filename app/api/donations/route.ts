import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import Razorpay from "razorpay"
import paypal from "paypal-rest-sdk"

const stripe = new Stripe("your-stripe-secret-key", {
  apiVersion: "2022-11-15",
})

const razorpay = new Razorpay({
  key_id: "your-razorpay-key-id",
  key_secret: "your-razorpay-key-secret",
})

paypal.configure({
  mode: "sandbox", // sandbox or live
  client_id: "your-paypal-client-id",
  client_secret: "your-paypal-client-secret",
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { restaurantId, amount, isAnonymous, message, paymentMethod } = body

    console.log("[v0] Processing donation:", { restaurantId, amount, paymentMethod })

    // Validate donation amount
    if (!amount || amount < 5) {
      return NextResponse.json({ error: "Minimum donation amount is $5" }, { status: 400 })
    }

    // Validate payment method
    if (!paymentMethod || !["card", "upi", "wallet"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 })
    }

    // Calculate rewards
    const tokens = Math.floor(amount / 5)
    const scratchCards = Math.floor(amount / 10)

    let paymentResult = null

    try {
      if (paymentMethod === "card") {
        // Integrate with Stripe
        console.log("[v0] Processing Stripe payment for amount:", amount)
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount * 100, // Convert to cents
          currency: "usd",
          metadata: {
            restaurantId,
            isAnonymous: isAnonymous.toString(),
            message: message || "",
          },
        })
        paymentResult = { paymentIntentId: paymentIntent.id }
      } else if (paymentMethod === "upi") {
        // Integrate with UPI payment gateway (Razorpay UPI, etc.)
        console.log("[v0] Processing UPI payment for amount:", amount)
        const upiPayment = await razorpay.payments.create({
          amount: amount * 100,
          currency: "INR",
          method: "upi",
          metadata: { restaurantId, isAnonymous, message },
        })
        paymentResult = { upiTransactionId: upiPayment.id }
      } else if (paymentMethod === "wallet") {
        // Integrate with PayPal or other wallet services
        console.log("[v0] Processing wallet payment for amount:", amount)
        const walletPayment = await paypal.payment.create({
          amount: amount,
          currency: "USD",
          metadata: { restaurantId, isAnonymous, message },
        })
        paymentResult = { walletTransactionId: walletPayment.id }
      }
    } catch (paymentError) {
      console.error("[v0] Payment processing failed:", paymentError)
      return NextResponse.json({ error: "Payment processing failed" }, { status: 402 })
    }

    // Create donation record
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
      timestamp: new Date().toISOString(),
      ...paymentResult,
    }

    console.log("[v0] Donation completed successfully:", donation.id)

    // Save to database
    // await saveDonation(donation);

    // Send confirmation email/SMS
    // await sendDonationConfirmation(donation);

    return NextResponse.json({
      success: true,
      donation,
      message: "Donation processed successfully",
    })
  } catch (error) {
    console.error("Donation processing error:", error)
    return NextResponse.json({ error: "Failed to process donation" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // Fetch from database
    // const donations = await getDonationsByUser(userId);

    // Mock donation history
    const mockDonations = [
      {
        id: "donation_1",
        restaurantName: "Annapurna Restaurant",
        restaurantAddress: "Main Road, Vizianagaram",
        amount: 25,
        tokens: 5,
        scratchCards: 2,
        isAnonymous: false,
        message: "Hope this helps someone in need",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        status: "completed",
      },
      {
        id: "donation_2",
        restaurantName: "Sai Krishna Tiffins",
        restaurantAddress: "Station Road, Vizianagaram",
        amount: 15,
        tokens: 3,
        scratchCards: 1,
        isAnonymous: true,
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        status: "completed",
      },
    ]

    return NextResponse.json({
      success: true,
      donations: mockDonations,
    })
  } catch (error) {
    console.error("Failed to fetch donations:", error)
    return NextResponse.json({ error: "Failed to fetch donations" }, { status: 500 })
  }
}
