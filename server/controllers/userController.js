const crypto = require("crypto");
const { sendEmail } = require("../utils/emailService");

const otpStore = new Map();

const generateOTP = async (req, res) => {
  console.log("Request received at /generate-otp"); // Log when endpoint is hit
  console.log("Request body:", req.body); // Log the incoming request body
  const { email } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString();
  otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

  try {
    await sendEmail(
      email,
      "Your OTP verification code for Infinora",
      `Your OTP is ${otp}`
    );
    console.log(`OTP sent to email: ${email}`);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP: ", error);
    res.status(500).json({ message: "Failed to send OTP to email" });
  }
};

const verifyOTP = (req, res) => {
  const { otp } = req.body;
  console.log(otp);
  res.status(200).json({ message: "OTP successfully verified" });
};

module.exports = { generateOTP, verifyOTP };
