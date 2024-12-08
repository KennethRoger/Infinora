const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  approveCreatorStatus,
  rejectCreatorStatus,
} = require("../controllers/adminController");
const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.patch("/approve-vendor", approveCreatorStatus);
router.patch("/reject-vendor", rejectCreatorStatus);

module.exports = router;
