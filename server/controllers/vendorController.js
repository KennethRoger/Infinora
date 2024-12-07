const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { verifyToken } = require("../utils/tokenValidator");
const cloudinary = require("../config/cloudinaryConfig");

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

    user.isVerified = true;
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
    console.log("Processing vendor details update...");
    console.log(
      "Files received:",
      req.files ? Object.keys(req.files) : "No files"
    );

    let profileImagePath = null;
    if (req.files && req.files.profileImage) {
      try {
        const b64 = Buffer.from(req.files.profileImage[0].buffer).toString(
          "base64"
        );
        const dataURI =
          "data:" + req.files.profileImage[0].mimetype + ";base64," + b64;

        console.log("Uploading profile image to Cloudinary...");
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "infinora/vendors/profile",
          width: 500,
          height: 500,
          crop: "fill",
          quality: "auto",
        });
        profileImagePath = result.secure_url;
        console.log("Profile image uploaded successfully");
      } catch (error) {
        console.error("Error uploading profile image:", error);
        throw new Error("Failed to upload profile image: " + error.message);
      }
    }

    let idProofPath = null;
    if (req.files && req.files.idCard) {
      try {
        const b64 = Buffer.from(req.files.idCard[0].buffer).toString("base64");
        const dataURI =
          "data:" + req.files.idCard[0].mimetype + ";base64," + b64;

        console.log("Uploading ID card to Cloudinary...");
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "infinora/vendors/id_proofs",
          format: "pdf",
          pages: true,
        });
        idProofPath = result.secure_url;
        console.log("ID card uploaded successfully");
      } catch (error) {
        console.error("Error uploading ID card:", error);
        throw new Error("Failed to upload ID card: " + error.message);
      }
    }

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    console.log("Updating user details in database...");
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      {
        name,
        speciality,
        bio,
        socialLink,
        about,
        profileImagePath,
        idProofPath,
        vendorStatus: "pending",
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("Vendor details updated successfully");
    res.status(200).json({
      success: true,
      message: "Vendor details updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in registerVendorDetails:", error);
    res.status(500).json({
      success: false,
      message: "Error updating vendor details",
      error: error.message,
    });
  }
};

module.exports = { verifyVendor, registerVendorDetails };
