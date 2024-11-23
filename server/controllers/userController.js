const crypto = require("crypto");
const bcryptjs = require("bcryptjs");
const { sendEmail } = require("../utils/emailService");
const TempUser = require("../models/TempUser");
const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");

const generateOTP = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;
    const hashPassword = await bcryptjs.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999).toString();
    const tempUser = await TempUser.create({
      email,
      phoneNumber,
      password: hashPassword,
      otp,
    });
    await sendEmail(
      email,
      "Your OTP verification code for Infinora",
      `Your OTP is ${otp}`
    );
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      tempUserId: tempUser._id,
    });
  } catch (error) {
    console.error("Error sending OTP: ", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send OTP to email" });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { tempUserId, otp } = req.body;
    console.log(otp);
    const tempUser = await TempUser.findById(tempUserId);

    if (!tempUser) {
      return res.status(400).json({ success: false, message: "OTP expired!" });
    }

    if (tempUser.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const newUser = await User.create({
      email: tempUser.email,
      phoneNumber: tempUser.phoneNumber,
      password: tempUser.password,
    });

    await TempUser.findByIdAndDelete(tempUserId);
    res.status(201).json({
      success: true,
      message: "OTP verified and user created successfully",
      data: { userId: newUser._id },
    });
  } catch (error) {
    console.error("OTP verification failed:", error);
    res
      .status(500)
      .json({ success: false, message: "OTP verification failed" });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { tempUserId } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString();
    await TempUser.findByIdAndUpdate({ tempUserId }, { otp });
    await sendEmail(
      email,
      "Your OTP verification code for Infinora",
      `Your OTP is ${otp}`
    );
  } catch (error) {}
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "email or password is incorrect" });
    const validPass = bcryptjs.compare(password, user.password);
    if (!validPass)
      return res
        .status(400)
        .json({ message: "email or password is incorrect" });
    const token = generateToken(user);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      message: "Login successful",
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Sign-In Error:", error);
    res.status(500).json({ success: false, message: "Authentication failed." });
  }
};

const googleSignIn = async (req, res) => {
  const { googleId, email, name, picture, verifiedEmail } = req.body;

  try {
    let user = await User.findOne({ $or: [{ googleId }, { email }] });
    if (!user) {
      const newUser = new User({
        name,
        email,
        googleId,
        googlePicture: picture,
        googleVerified: verifiedEmail,
      });
      await newUser.save();
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        googlePicture: user.googlePicture,
      },
    });
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    res.status(500).json({ success: false, message: "Authentication failed." });
  }
};

module.exports = { generateOTP, verifyOTP, login, googleSignIn };
