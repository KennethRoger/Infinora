const Order = require("../models/Order");
const Product = require("../models/Product");
const { verifyToken } = require("../utils/tokenValidator");

// Create new order
const createOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod, items } = req.body;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    // Get current date for orderId generation
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");

    // Get the count of orders for today
    const todayStart = new Date(date.setHours(0, 0, 0, 0));
    const todayEnd = new Date(date.setHours(23, 59, 59, 999));
    const orderCount = await Order.countDocuments({
      createdAt: {
        $gte: todayStart,
        $lt: todayEnd,
      },
    });

    // Create separate orders for each item
    const orderPromises = items.map(async (item, index) => {
      // Get product to get vendor information
      const product = await Product.findById(item.productId).populate("vendor");
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const totalAmount =
        item.price * item.quantity * (1 - item.discount / 100);

      // Generate orderId: INF-YYMMDD-XXXX
      const orderId = `INF-${year}${month}${day}-${(orderCount + index + 1)
        .toString()
        .padStart(4, "0")}`;

      return Order.create({
        orderId,
        user: userId,
        product: item.productId,
        variant: product.variant._id,
        selectedVariant: item.selectedVariant,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        address: addressId,
        paymentMethod,
        vendor: product.vendor._id,
        totalAmount,
        status: "pending",
      });
    });

    const orders = await Promise.all(orderPromises);

    // Populate necessary fields for response
    const populatedOrders = await Promise.all(
      orders.map((order) =>
        Order.findById(order._id)
          .populate("user", "name email")
          .populate("address")
          .populate({
            path: "product",
            select: "name images variant",
            populate: {
              path: "vendor",
              select: "name",
            },
          })
      )
    );

    res.status(201).json({
      success: true,
      message: "Orders created successfully",
      orders: populatedOrders,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create orders",
      error: error.message,
    });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("address")
      .populate({
        path: "product",
        select: "name images variant",
        populate: {
          path: "vendor",
          select: "name",
        },
      });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const order = await Order.findOne({ _id: id, user: userId })
      .populate("user", "name email")
      .populate("address")
      .populate({
        path: "product",
        select: "name images variant",
        populate: {
          path: "vendor",
          select: "name",
        },
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Prevent cancellation of delivered orders
    if (status === "cancelled" && order.status === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel delivered orders",
      });
    }

    order.status = status;
    if (status === "delivered") {
      order.deliveryDate = new Date();
    }

    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate("user", "name email")
      .populate("address")
      .populate({
        path: "product",
        select: "name images variant",
        populate: {
          path: "vendor",
          select: "name",
        },
      });

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
};
