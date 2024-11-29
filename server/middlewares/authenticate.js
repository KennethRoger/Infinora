const { verifyToken } = require("../utils/generateToken");

const authenticate = (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers["authorization"]?.split("")[1];
    if (!token) {
      res.status(401).json({ message: "Authentication token missing" });
    }
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
