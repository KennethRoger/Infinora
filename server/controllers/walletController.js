const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transactions");
const { verifyToken } = require("../utils/tokenValidator");
const createWalletTransaction = require("../utils/walletUtils");
const crypto = require("crypto");

const getWalletBalance = async (req, res) => {
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
};

const getWalletTransactions = async (req, res) => {
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalTransactions = await Transaction.countDocuments({ userId });
    const totalPages = Math.ceil(totalTransactions / limit);

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('orderId');

    res.json({
      success: true,
      transactions,
      pagination: {
        currentPage: page,
        totalPages,
        totalTransactions,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const verifyWalletPayment = async (req, res) => {
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
};

const processWalletPayment = async (req, res) => {
  try {
    const { amount } = req.body;
    
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to process payment",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const wallet = await Wallet.findOne({ userId });
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance",
      });
    }

    const { transaction } = await createWalletTransaction({
      userId,
      amount: amount,  
      type: "debit",
      description: "Payment for order",
      reference: `wallet_payment_${Date.now()}`,
      paymentMethod: "wallet"
    });

    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      transactionId: transaction._id,
      remainingBalance: wallet.balance - amount,  
    });
  } catch (error) {
    console.error("Error in processWalletPayment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process wallet payment",
      error: error.message,
    });
  }
};

module.exports = {
  getWalletBalance,
  getWalletTransactions,
  verifyWalletPayment,
  processWalletPayment,
};
