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
  getAllUsers,
  updateUser,
  generateOTPForForgotPass,
  confirmOTP,
  newPassword,
  getAllVendors
} = require("../controllers/userController");
const { authorizeUser } = require("../middlewares/authenticate");

router.post("/register", generateOTP);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.post("/google-signin", googleSignIn);
router.get("/me", authorizeUser(["user", "vendor", "admin"]), getUserInfo);
router.post("/logout", authorizeUser(["user", "vendor", "admin"]), logout);
router.get("/all", authorizeUser(["user", "vendor", "admin"]), getAllUsers);
router.post("/update-profile", authorizeUser(["user", "vendor", "admin"]), updateUser);
router.post("/generate-otp", generateOTPForForgotPass);
router.post("/confirm-otp", confirmOTP);
router.post("/new-password", authorizeUser(["user", "vendor", "admin"]), newPassword);
router.get("/vendors", authorizeUser(["user", "vendor", "admin"]), getAllVendors);

module.exports = router;
