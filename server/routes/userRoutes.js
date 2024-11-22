const express = require("express");
const router = express.Router();

const { generateOTP, verifyOTP } = require("../controllers/userController");

router.post("/generate-otp", generateOTP);
router.post("/verify-otp", verifyOTP);
router.post("/google-singin", )

module.exports = router;
