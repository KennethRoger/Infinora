const { verifyToken } = require("../utils/tokenValidator");
const User = require("../models/User");
const bcryptjs = require("bcryptjs");

const verifyUser = async (req, res) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ authenticated: false, message: "No token provided." });
  }

  try {
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select("role isBlocked");

    if (!user) {
      return res
        .status(404)
        .json({ authenticated: false, message: "User not found." });
    }

    if (user.isBlocked) {
      return res
        .status(403)
        .json({ authenticated: false, message: "User is blocked." });
    }

    res.status(200).json({
      authenticated: true,
      role: user.role,
      message: "User verified.",
    });
  } catch (error) {
    res
      .status(401)
      .json({ authenticated: false, message: "Invalid or expired token." });
  }
};

const blockUserOrVendor = async (req, res) => {
  const { id, role } = req.body;

  if (!id || !role) {
    return res.status(400).json({ message: "User ID and role are required." });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role !== role) {
      return res.status(400).json({ message: "Role mismatch." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isBlocked: !user.isBlocked },
      { new: true }
    );
    console.log(updatedUser);

    if (!updatedUser) {
      console.log(updatedUser);
      return res.status(500).json({
        message: "An error occurred while updating the user's blocked status.",
      });
    }

    res.status(200).json({
      success: true,
      message: `${role} ${
        updatedUser.isBlocked ? "blocked" : "unblocked"
      } successfully.`,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating the user's blocked status.",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { token } = req.cookies;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }
    const userId = decoded.id;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Old password and new password are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Unrecognized user access" });
    }

    const correctPassword = await bcryptjs.compare(oldPassword, user.password);
    if (!correctPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Entered password is incorrect" });
    }

    const isPasswordReused = await bcryptjs.compare(newPassword, user.password);
    if (isPasswordReused) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the old password",
      });
    }

    const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server encountered error. Try again later.",
    });
  }
};

module.exports = { verifyUser, blockUserOrVendor, changePassword };
