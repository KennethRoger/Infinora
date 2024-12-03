const express = require("express");
const { verifyUser, blockUserOrVendor } = require("../controllers/authController");
const router = express.Router();

router.get("/verify", verifyUser);
router.post("/block", blockUserOrVendor);

module.exports = router;
