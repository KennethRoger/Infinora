const User = require("../models/User");
const { verifyToken } = require("../utils/tokenValidator");

const authorizeUser = (roles) => async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Please login to access" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    if (user.isBlocked) {
      return res.status(401).json({ message: "User account is blocked" });
    }

    const userRole = decoded.role;
    if (!roles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: `Access denied for role: ${userRole}` });
    }

    req.user = user;
    
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Authentication failed", error: error.message });
  }
};

module.exports = { authorizeUser };
