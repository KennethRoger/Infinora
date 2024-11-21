const crypto = require("crypto");
const bcryptjs = require("bcryptjs");
const { sendEmail } = require("../utils/emailService");
const TempUser = require("../models/TempUser");

const generateOTP = async (req, res) => {
  const { email, phoneNumber, password } = req.body;
  const hashPassword = await bcryptjs.hash(password, 10);
  const otp = crypto.randomInt(100000, 999999).toString();
  await TempUser.create({
    email,
    phoneNumber,
    password: hashPassword,
    otp,
  });

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
  console.log(req.body);
  const { otp } = req.body;
  console.log(otp);
  res.status(200).json({ message: "OTP successfully verified" });
};

module.exports = { generateOTP, verifyOTP };
