import nodemailer from "nodemailer"

export async function sendEmail(to: string, otp: string) {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER || process.env.EMAIL_USER
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS
  const from = process.env.SMTP_FROM || user

  if (!host || !user || !pass || !from) {
    const missing = [
      !host ? "SMTP_HOST" : null,
      !process.env.SMTP_PORT ? "SMTP_PORT(defaulting to 587)" : null,
      !user ? "SMTP_USER" : null,
      !pass ? "SMTP_PASS" : null,
      !from ? "SMTP_FROM" : null,
    ].filter(Boolean)
    const error = new Error(`SMTP config is missing: ${missing.join(", ")}`)
    console.error("[email] config error", error.message)
    return { success: false, error: error.message, fallback: false as const }
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    await transporter.verify()
    await transporter.sendMail({
      from,
      to,
      subject: "DishDirect OTP Verification",
      text: `Your DishDirect OTP is ${otp}. It expires in 15 minutes.`,
    })
    return { success: true, fallback: false as const }
  } catch (error) {
    const err = error as Error & { code?: string; response?: string }
    console.error("[email] SMTP send failed", {
      message: err.message,
      code: err.code,
      response: err.response,
      host,
      port,
      user,
      from,
      to,
    })
    return {
      success: false,
      error: err.message || "SMTP send failed",
      fallback: false as const,
    }
  }
}