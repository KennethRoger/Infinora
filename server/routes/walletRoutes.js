const express = require("express");
const router = express.Router();
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transactions");
const { verifyToken } = require("../utils/tokenValidator");

router.get("/balance", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to view wallet",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const wallet = await Wallet.findOne({ userId });
    
    res.json({
      success: true,
      balance: wallet?.balance || 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to view transactions",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .populate('orderId');

    res.json({
      success: true,
      transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;