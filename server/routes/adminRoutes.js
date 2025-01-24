const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  approveCreatorStatus,
  rejectCreatorStatus,
} = require("../controllers/adminController");
const { authorizeUser } = require("../middlewares/authenticate");
const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.patch("/approve-vendor", authorizeUser(["admin"]), approveCreatorStatus);
router.patch("/reject-vendor", authorizeUser(["admin"]), rejectCreatorStatus);

module.exports = router;
