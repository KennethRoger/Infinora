const express = require("express");
const router = express.Router();
const {
  createRazorpayOrder,
  verifyPayment,
} = require("../controllers/paymentController");
const { authorizeUser } = require("../middlewares/authenticate");

router.post("/create-order", authorizeUser(["user", "vendor", "admin"]), createRazorpayOrder);
router.post("/verify", authorizeUser(["user", "vendor", "admin"]), verifyPayment);

module.exports = router;
