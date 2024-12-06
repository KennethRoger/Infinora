const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken } = require("../utils/tokenValidator");
const cloudinary = require("cloudinary").v2;

const verifyVendor = async (req, res) => {
  const { password, terms } = req.body;

  if (!terms) {
    return res.status(400).json({
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

    res.status(200).json({
      success: true,
      message: "Verification successful. You are now a vendor.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error.", error: error.message });
  }
};

// Register vendor details
const registerVendorDetails = async (req, res) => {
  try {
    const { name, speciality, bio, socialLink, about } = req.body;
    const userId = req.user.id; // Assuming you have user ID from auth middleware

    // Upload profile image to cloudinary if exists
    let profileImagePath = null;
    if (req.files && req.files.profileImage) {
      const result = await cloudinary.uploader.upload(
        req.files.profileImage[0].path,
        {
          folder: "infinora/vendors/profile",
          width: 500,
          height: 500,
          crop: "fill",
          quality: "auto",
        }
      );
      profileImagePath = result.secure_url;
    }

    // Upload ID proof to cloudinary if exists
    let idProofPath = null;
    if (req.files && req.files.idCard) {
      const result = await cloudinary.uploader.upload(
        req.files.idCard[0].path,
        {
          folder: "infinora/vendors/id_proofs",
          width: 800,
          quality: "auto",
        }
      );
      idProofPath = result.secure_url;
    }

    // Update user with vendor details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        role: "vendor",
        name,
        speciality,
        bio,
        socialLink,
        about,
        ...(profileImagePath && { profileImagePath }),
        ...(idProofPath && { idProofPath }),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vendor details updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Vendor registration error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating vendor details",
      error: error.message,
    });
  }
};

module.exports = { verifyVendor, registerVendorDetails };
