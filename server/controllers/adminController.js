const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../utils/tokenValidator");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const registerAdmin = async (req, res) => {
  try {
    const { name, adminId, password } = req.body;

    const existingAdmin = await User.findOne({ adminId });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin ID already exists." });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const adminUser = new User({
      role: "admin",
      name,
      adminId,
      password: hashedPassword,
    });

    await adminUser.save();

    res.status(201).json({ message: "Admin created successfully!" });
  } catch (error) {
    console.error("Error signing up admin:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { name, adminId, password } = req.body;

    const adminUser = await User.findOne({ name, adminId, role: "admin" });
    if (!adminUser) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const isPasswordValid = await bcryptjs.compare(
      password,
      adminUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = generateToken(adminUser);

    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      message: "Login successful!",
      data: { role: "admin", user: name },
    });
  } catch (error) {
    console.error("Error logging in admin:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Creator

const approveCreatorStatus = async (req, res) => {
  try {
    const { creatorId } = req.body;

    const creator = await User.findById(creatorId);
    if (!creator) {
      return res.status(404).json({
        success: false,
        message: "Creator not found.",
      });
    }

    // Check if creator is in a valid state to be approved
    if (creator.vendorStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Creator is not in pending status.",
      });
    }

    await User.updateOne(
      { _id: creatorId },
      { $set: { vendorStatus: "approved" } }
    );

    res.status(200).json({
      success: true,
      message: "Creator has been approved successfully.",
      data: {
        creatorId: creator._id,
        name: creator.name,
        email: creator.email,
        status: "approved",
      },
    });
  } catch (error) {
    console.error("Error approving creator:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve creator. Please try again.",
    });
  }
};

const rejectCreatorStatus = async (req, res) => {
  try {
    const { creatorId } = req.body;

    const creator = await User.findById(creatorId);
    if (!creator) {
      return res.status(404).json({
        success: false,
        message: "Creator not found.",
      });
    }

    // Check if creator is in a valid state to be rejected
    if (creator.vendorStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Creator is not in pending status.",
      });
    }

    await User.updateOne(
      { _id: creatorId },
      { $set: { vendorStatus: "rejected" } }
    );

    res.status(200).json({
      success: true,
      message: "Creator has been rejected successfully.",
      data: {
        creatorId: creator._id,
        name: creator.name,
        email: creator.email,
        status: "rejected",
      },
    });
  } catch (error) {
    console.error("Error rejecting creator:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject creator. Please try again.",
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  approveCreatorStatus,
  rejectCreatorStatus,
};
