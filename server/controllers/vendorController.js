const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../utils/tokenValidator');
const { default: cloudinary } = require('../config/cloudinaryConfig');

const verifyVendor = async (req, res) => {
  const { password, terms } = req.body;

  if (!terms) {
    return res.status(400).json({ success: false, message: "You must accept the terms and conditions." });
  }

  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "No authentication token found." });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect password." });
    }

    user.role = 'vendor';
    await user.save();

    res.status(200).json({ success: true, message: "Verification successful. You are now a vendor." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};

const registerVendor = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const { profileImage, idCard, ...vendorData } = req.body;

    const profileImageResult = await cloudinary.uploader.upload(profileImage, {
      folder: 'users/profile_images',
    });

    const idCardResult = await cloudinary.uploader.upload(idCard, {
      folder: 'users/id_cards',
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...vendorData,
        role: 'vendor',
        profileImagePath: profileImageResult.secure_url,
        idCardPath: idCardResult.secure_url,
      },
      { new: true }
    );

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Vendor registration error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { verifyVendor, registerVendor };
