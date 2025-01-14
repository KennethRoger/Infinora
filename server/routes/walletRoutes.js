const express = require("express");
const router = express.Router();
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transactions");
const { verifyToken } = require("../utils/tokenValidator");
const createWalletTransaction = require("../utils/walletUtils");
const crypto = require("crypto");

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

router.post("/verify-payment", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to add money",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body;

    // Verify Razorpay payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Create wallet transaction
    await createWalletTransaction({
      userId,
      amount: Number(amount),
      type: "credit",
      description: "Added money to wallet",
      reference: razorpay_payment_id,
      paymentMethod: "razorpay",
    });

    res.json({
      success: true,
      message: "Payment verified and wallet updated successfully",
    });
  } catch (error) {
    console.error("Error in verify wallet payment:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to verify payment",
    });
  }
});

module.exports = router;