const crypto = require("crypto");
const bcryptjs = require("bcryptjs");
const { sendEmail } = require("../utils/emailService");
const TempUser = require("../models/TempUser");
const User = require("../models/User");
const { generateToken, verifyToken } = require("../utils/tokenValidator");
const { PerformanceNodeTiming } = require("perf_hooks");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const generateOTP = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, isUpdate = false } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    if (!isUpdate) {
      const existingPhoneUser = await User.findOne({ phoneNumber });
      if (existingPhoneUser) {
        return res.status(400).json({
          success: false,
          message: "Phone number already exists",
        });
      }
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const tempUserData = {
      name,
      email,
      phoneNumber,
      otp,
    };

    if (password) {
      const hashedPassword = await bcryptjs.hash(password, 10);
      tempUserData.password = hashedPassword;
    }

    const tempUser = await TempUser.create(tempUserData);

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
    res.status(500).json({
      success: false,
      message: "Failed to send OTP to email",
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { userId, tempUserId, otp, isUpdate = false } = req.body;
    const tempUser = await TempUser.findById(tempUserId);

    if (!tempUser) {
      return res
        .status(400)
        .json({ expired: true, success: false, message: "OTP expired!" });
    }

    if (tempUser.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    let newUser;
    if (isUpdate) {
      newUser = await User.findByIdAndUpdate(
        { _id: userId },
        {
          email: tempUser.email,
          phoneNumber: tempUser.phoneNumber,
        }
      );
    } else {
      newUser = await User.create({
        email: tempUser.email,
        phoneNumber: tempUser.phoneNumber,
        password: tempUser.password,
      });
    }

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
    if (user.isBlocked)
      return res
        .status(403)
        .json({ message: "Access denied! Contact Support" });
    const validPass = await bcryptjs.compare(password, user.password);
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

      if (user.googleId === uid && user.email !== email) {
        r;
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
      user,
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find({}, { password: 0 }).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phoneNumber !== undefined) {
      if (phoneNumber !== existingUser.phoneNumber) {
        const phoneExists = await User.findOne({
          phoneNumber,
          _id: { $ne: existingUser._id },
        });
        if (phoneExists) {
          return res.status(400).json({
            success: false,
            message: "Phone number is already in use",
          });
        }
      }
      updateData.phoneNumber = phoneNumber;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: existingUser._id },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Failed to update user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update user",
    });
  }
};

const generateOTPForForgotPass = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email does not exists",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();

    const tempUserData = {
      email,
      otp,
    };

    const tempUser = await TempUser.create(tempUserData);

    await sendEmail(
      email,
      "Your OTP code to change your password of Infinora",
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
    res.status(500).json({
      success: false,
      message: "Failed to send OTP to email",
    });
  }
};

const confirmOTP = async (req, res) => {
  try {
    const { tempUserId, otp } = req.body;

    if (!tempUserId || !otp)
      return res
        .status(400)
        .json({ success: false, message: "Can't validate the data recieved" });

    const tempUser = await TempUser.findById(tempUserId);

    if (!tempUser)
      return res
        .status(400)
        .json({ success: false, message: "User data was expired" });

    if (tempUser.otp != otp)
      res.status(400).json({ success: false, message: "OTP is not valid" });

    res
      .status(200)
      .json({ success: true, message: "OTP is successfully verified" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some kind of unknown error has occured",
    });
  }
};

const newPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const token = req.cookies.token;
    const decoded = verifyToken(token);
    if (decoded.role && decoded.role != "admin") {
      res.status(400).json({ success: false, message: "Unauthorized access" });
    }

    const totalVendors = await User.countDocuments({
      isVerified: true,
      role: "vendor",
    });

    const vendors = await User.find({ isVerified: true, role: "vendor" })
      .skip(skip)
      .limit(limit);
    const verifiedUsers = await User.find({ isVerified: true, vendorStatus: "pending",  role: "user" });

    res.status(200).json({
      success: true,
      data: {
        verifiedUsers,
        vendors,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalVendors / limit),
          totalVendors,
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
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
  updateUser,
  generateOTPForForgotPass,
  confirmOTP,
  newPassword,
  getAllVendors,
};
