const User = require("../models/User");
const { verifyToken } = require("../utils/tokenValidator");

const authorizeToken = async (req, res, next) => {
  const token =
    req.cookies?.token || req.headers["authorization"]?.split("")[1];
  if (!token) {
    res.status(401).json({ message: "Not Authorized, token missing" });
  }
  try {
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "User is blocked." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token invalid." });
  }
};

const authorizeRoles =
  (roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Access denied for role: ${req.user.role}` });
    }
    next();
  };

module.exports = { authorizeToken, authorizeRoles };
