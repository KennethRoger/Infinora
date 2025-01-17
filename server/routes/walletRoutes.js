const express = require("express");
const router = express.Router();
const {
  getWalletBalance,
  getWalletTransactions,
  verifyWalletPayment,
  processWalletPayment,
} = require("../controllers/walletController");

router.get("/balance", getWalletBalance);
router.get("/transactions", getWalletTransactions);
router.post("/verify-payment", verifyWalletPayment);
router.post("/process-payment", processWalletPayment);

module.exports = router;
