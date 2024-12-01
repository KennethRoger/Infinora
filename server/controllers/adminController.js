const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../utils/tokenValidator");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 1000,
};

const registerAdmin = async (req, res) => {
  try {
    const { name, adminId, password } = req.body;

    const existingAdmin = await User.findOne({ adminId });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin ID already exists." });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const hashedId = await bcryptjs.hash(adminId, 10);

    const adminUser = new User({
      role: "admin",
      name,
      adminId: hashedId,
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

    const adminUser = await User.findOne({ name, role: "admin" });
    if (!adminUser) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const isAdminIdValid = await bcryptjs.compare(adminId, adminUser.adminId);
    if (!isAdminIdValid) {
      return res.status(401).json({ message: "Invalid credentials." });
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

module.exports = { registerAdmin, loginAdmin };
