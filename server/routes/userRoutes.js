const express = require("express");
const router = express.Router();

const {
  generateOTP,
  verifyOTP,
  login,
  googleSignIn,
} = require("../controllers/userController");

router.post("/register", generateOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login", login)
router.post("/google-signin", googleSignIn);

module.exports = router;
