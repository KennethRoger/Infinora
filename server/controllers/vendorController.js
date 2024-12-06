const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken } = require("../utils/tokenValidator");

const verifyVendor = async (req, res) => {
  const { password, terms } = req.body;

  if (!terms) {
    return res
      .status(400)
      .json({
        success: false,
        message: "You must accept the terms and conditions.",
      });
  }

  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No authentication token found." });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password." });
    }

    user.role = "vendor";
    await user.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Verification successful. You are now a vendor.",
      });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

const registerVendor = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    // Temporarily store files locally or handle them later with AWS S3
    const { profileImage, idCard, ...vendorData } = req.body;

    // TODO: Implement AWS S3 upload logic here
    const profileImageUrl = null; // Will be replaced with S3 URL
    const idCardUrl = null; // Will be replaced with S3 URL

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...vendorData,
        profileImage: profileImageUrl,
        idCard: idCardUrl,
        role: "vendor",
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Vendor registration successful",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering vendor",
      error: error.message,
    });
  }
};

module.exports = { verifyVendor, registerVendor };
