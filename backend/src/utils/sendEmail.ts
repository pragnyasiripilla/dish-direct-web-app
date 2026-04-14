import nodemailer from "nodemailer";

export async function sendEmail(to: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "DishDirect OTP",
    text: `Your OTP is ${otp}. It expires in 15 minutes.`,
  });
}