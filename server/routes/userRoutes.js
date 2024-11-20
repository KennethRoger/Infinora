const express = require("express");
const router = express.Router();

const { generateOTP } = require("../controllers/userController");

router.post("/generate-otp", generateOTP);

module.exports = router;
