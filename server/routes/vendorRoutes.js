const express = require("express");
const router = express.Router();
const { verifyVendor, registerVendor } = require("../controllers/vendorController");

router.post("/verify", verifyVendor);
router.post("/register", registerVendor);

module.exports = router;