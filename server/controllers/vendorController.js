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

const registerVendorDetails = async (req, res) => {
  try {
    const { name, speciality, bio, socialLink, about } = req.body;

    let profileImagePath = null;
    if (req.files && req.files.profileImage) {
      // Convert buffer to base64 string for Cloudinary
      const b64 = Buffer.from(req.files.profileImage[0].buffer).toString(
        "base64"
      );
      const dataURI =
        "data:" + req.files.profileImage[0].mimetype + ";base64," + b64;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "infinora/vendors/profile",
        width: 500,
        height: 500,
        crop: "fill",
        quality: "auto",
      });
      profileImagePath = result.secure_url;
    }

    let idProofPath = null;
    if (req.files && req.files.idCard) {
      // Convert buffer to base64 string for Cloudinary
      const b64 = Buffer.from(req.files.idCard[0].buffer).toString("base64");
      const dataURI = "data:" + req.files.idCard[0].mimetype + ";base64," + b64;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "infinora/vendors/id_proofs",
        width: 800,
        quality: "auto",
      });
      idProofPath = result.secure_url;
    }

    // Create new user entry
    const newUser = await User.create({
      role: "vendor",
      name,
      speciality,
      bio,
      socialLink,
      about,
      profileImagePath,
      idProofPath,
    });

    res.status(200).json({
      success: true,
      message: "Vendor details saved successfully",
      user: newUser,
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
