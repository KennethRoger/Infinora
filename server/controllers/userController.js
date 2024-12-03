const crypto = require("crypto");
const bcryptjs = require("bcryptjs");
const { sendEmail } = require("../utils/emailService");
const TempUser = require("../models/TempUser");
const User = require("../models/User");
const { generateToken, verifyToken } = require("../utils/tokenValidator");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 1000,
};

const generateOTP = async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;
    const hashPassword = await bcryptjs.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999).toString();
    const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "Email or phone number already exists" });
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
      data: {
        tempUserId: tempUser._id,
        email: tempUser.email,
      },
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
    const tempUser = await TempUser.findById(tempUserId);

    if (!tempUser) {
      return res.status(400).json({ expired: true, success: false, message: "OTP expired!" });
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
    const token = generateToken(newUser);

    res.cookie("token", token, cookieOptions);
    res.status(201).json({
      success: true,
      message: "OTP verified and user created successfully",
      user: { id: newUser._id, email: newUser.email, role: newUser.role },
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
    const { tempUserId, email } = req.body;

    const otp = crypto.randomInt(100000, 999999).toString();

    const updatedUser = await TempUser.findByIdAndUpdate(
      tempUserId,
      {
        otp,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Temporary user not found.",
      });
    }

    await sendEmail(
      email,
      "Your OTP verification code for Infinora",
      `Your OTP is ${otp}`
    );

    res.status(200).json({
      success: true,
      message: "OTP resent successfully.",
    });
  } catch (error) {
    console.error("Error resending OTP: ", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "This user does not exist. Try registering" });
    const validPass = bcryptjs.compare(password, user.password);

    if (user.isBlocked)
      return res
        .status(403)
        .json({ message: "Access denied! Contact Support" });

    if (!validPass)
      return res
        .status(400)
        .json({ message: "email or password is incorrect" });

    const token = generateToken(user);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Sign-In Error:", error);
    res.status(500).json({ success: false, message: "Authentication failed." });
  }
};

const googleSignIn = async (req, res) => {
  const { uid, email, displayName, photoURL, emailVerified } = req.body;
  try {
    let user = await User.findOne({ $or: [{ googleId: uid }, { email }] });

    if (!user) {
      const newUser = new User({
        name: displayName,
        email,
        googleId: uid,
        googlePicture: photoURL,
        googleVerified: emailVerified,
      });
      await newUser.save();

      const token = generateToken(newUser); 
      res.cookie("token", token, cookieOptions);

      return res.status(200).json({
        success: true,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          googlePicture: newUser.googlePicture,
        },
        message: "New user created.",
      });
    } else {
      let isUpdated = false;

      if (user.googleId === uid && user.email !== email) {r
        user.email = email;
        user.googleVerified = emailVerified;
        isUpdated = true;
      }

      if (isUpdated) {
        await user.save();
      }

      const token = generateToken(user);
      res.cookie("token", token, cookieOptions); 

      return res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          googlePicture: user.googlePicture,
        },
        message: isUpdated
          ? "User information updated."
          : "User already exists.",
      });
    }
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    res.status(500).json({ success: false, message: "Authentication failed." });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Get User Info Error:", error);
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

module.exports = {
  generateOTP,
  verifyOTP,
  resendOTP,
  login,
  googleSignIn,
  getUserInfo,
  logout,
  getAllUsers,
};
