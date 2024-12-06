const express = require("express");
const router = express.Router();
const {
  verifyVendor,
  registerVendorDetails,
} = require("../controllers/vendorController");

router.post("/verify", verifyVendor);
router.post("/register", registerVendorDetails);

module.exports = router;
