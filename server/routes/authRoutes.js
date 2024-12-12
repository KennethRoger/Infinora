const express = require("express");
const {
  verifyUser,
  blockUserOrVendor,
  changePassword,
} = require("../controllers/authController");
const router = express.Router();

router.get("/verify", verifyUser);
router.post("/block", blockUserOrVendor);
router.post("/change-password", changePassword);

module.exports = router;
