const { verifyToken } = require("../utils/tokenValidator");
const User = require("../models/User");

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

    res
      .status(200)
      .json({
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

module.exports = { verifyUser };
