const express = require("express");
const router = express.Router();
const {
  getWalletBalance,
  getWalletTransactions,
  verifyWalletPayment,
  processWalletPayment,
} = require("../controllers/walletController");
const { authorizeUser } = require("../middlewares/authenticate");

router.get("/balance", authorizeUser(["user", "vendor", "admin"]), getWalletBalance);
router.get("/transactions", authorizeUser(["user", "vendor", "admin"]), getWalletTransactions);
router.post("/verify-payment", authorizeUser(["user", "vendor", "admin"]), verifyWalletPayment);
router.post("/process-payment", authorizeUser(["user", "vendor", "admin"]), processWalletPayment);

module.exports = router;
