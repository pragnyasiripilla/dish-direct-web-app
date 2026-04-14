import { Router } from "express";
import { Otp } from "../../models/Otp.js";
import { sendEmail } from "../../utils/sendEmail.js";

const router = Router();

// Send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  await sendEmail(email, otp);

  res.json({ message: "OTP sent" });
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email, otp });

  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  await Otp.deleteMany({ email });

  res.json({ message: "OTP verified" });
});

export default router;