const TempOrder = require("../models/TempOrder");
const { verifyToken } = require("../utils/tokenValidator");

const createTempOrder = async (req, res) => {
  try {
    const { razorpayOrderId, items, shippingAddress, totalAmount, appliedCoupons } = req.body;
    
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to create order",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const tempOrder = await TempOrder.create({
      razorpayOrderId,
      items,
      userId,
      shippingAddress,
      totalAmount,
      appliedCoupons,
    });


    res.status(201).json({
      success: true,
      message: "Temporary order created successfully",
      data: tempOrder,
    });
  } catch (error) {
    console.error("Error in createTempOrder:", error);
    res.status(500).json({
      success: false,
      message: "Error creating temporary order",
      error: error.message,
    });
  }
};

const getTempOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to view order",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const tempOrder = await TempOrder.findById(id)
      .populate("items.productId")
      .populate("userId", "name email");

    if (!tempOrder) {
      return res.status(404).json({
        success: false,
        message: "Temporary order not found",
      });
    }

    if (tempOrder.userId._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      data: tempOrder,
    });
  } catch (error) {
    console.error("Error in getTempOrderById:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get temporary order",
      error: error.message,
    });
  }
};

const getUserTempOrders = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to view orders",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;
    console.log(userId)

    const tempOrders = await TempOrder.find({
      userId
    })
      .populate("items.productId")
      .sort({ createdAt: -1 });


    res.status(200).json({
      success: true,
      data: tempOrders,
    });
  } catch (error) {
    console.error("Error in getUserTempOrders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get temporary orders",
      error: error.message,
    });
  }
};

const deleteTempOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to delete order",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const tempOrder = await TempOrder.findById(id);

    if (!tempOrder) {
      return res.status(404).json({
        success: false,
        message: "Temporary order not found",
      });
    }

    if (tempOrder.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this order",
      });
    }

    await TempOrder.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Temporary order deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteTempOrder:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete temporary order",
      error: error.message,
    });
  }
};


module.exports = {
  createTempOrder,
  getTempOrderById,
  getUserTempOrders,
  deleteTempOrder
};
