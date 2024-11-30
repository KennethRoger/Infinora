const express = require("express");
const router = express.Router();

const {
  generateOTP,
  verifyOTP,
  resendOTP,
  login,
  googleSignIn,
  getUserInfo,
  logout,
} = require("../controllers/userController");

router.post("/register", generateOTP);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.post("/google-signin", googleSignIn);
router.post("/me", getUserInfo);
router.post("/logout", logout)

module.exports = router;
