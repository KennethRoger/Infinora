const express = require("express");
const {
  verifyUser,
  blockUserOrVendor,
  changePassword,
} = require("../controllers/authController");
const { authorizeUser } = require("../middlewares/authenticate");
const router = express.Router();

router.get("/verify", verifyUser);
router.post("/block", authorizeUser(["admin"]), blockUserOrVendor);
router.post(
  "/change-password",
  authorizeUser(["user", "vendor"]),
  changePassword
);

module.exports = router;
