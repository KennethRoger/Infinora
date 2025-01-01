const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { verifyToken } = require("../utils/tokenValidator");
const { generateOrderId } = require("../utils/generateOrderId");

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
    console.log(req.body);

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const orderPromises = items.map(async (item) => {
      console.log("Selected variant: ", item.selectedVariants);
      const product = await Product.findById(item.productId).populate("vendor");
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${item.productId}`);
      }

      const orderId = generateOrderId(userId);

      let totalAmount, variantPrice;
      if (product.productVariants.length === item.selectedVariants.length) {
        variantPrice = product.productVariants.reduce((price, variant) => {
          const currVariant = item.selectedVariants.find(
            (selectedVariant) =>
              selectedVariant.variantName === variant.variantName
          );
          const currVariantType = variant.variantTypes.find(
            (type) => type.name === currVariant.typeName
          );
          return (price += currVariantType.price);
        }, 0);

        totalAmount =
          variantPrice * (1 - product.discount / 100) * item.quantity;

        Order.create({
          orderId,
          user: userId,
          product: item.productId,
          selectedVariants: item.selectedVariants,
          quantity: item.quantity,
          price: variantPrice,
          discount: product.discount,
          address: addressId,
          paymentMethod,
          vendor: product.vendor._id,
          totalAmount,
          status: "pending",
        });

        Product.findByIdAndUpdate(item.productId, {
          stock: stock - item.quantity,
        });

        return;
      } else if (product.price) {
        totalAmount =
          product.price * (1 - product.discount / 100) * item.quantity;

        Order.create({
          orderId,
          user: userId,
          product: item.productId,
          selectedVariants: [],
          quantity: item.quantity,
          price: product.price,
          discount: product.discount,
          address: addressId,
          paymentMethod,
          vendor: product.vendor._id,
          totalAmount,
          status: "pending",
        });

        Product.findByIdAndUpdate(item.productId, {
          stock: stock - item.quantity,
        });
        return;
      } else {
        throw new Error(`Product variant not found: ${item.productId}`);
      }
    });

    const orders = await Promise.all(orderPromises);

    const populatedOrders = await Promise.all(
      orders.map((order) =>
        Order.findById(order._id)
          .populate("address")
          .populate({
            path: "product",
            select: "name images productVariants",
            populate: {
              path: "vendor",
              select: "name",
            },
          })
      )
    );

    await Cart.findOneAndUpdate({ user: userId }, { items: [] }, { new: true });

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
      .populate("address")
      .populate({
        path: "product",
        select: "name images variant",
        populate: {
          path: "vendor",
          select: "name",
        },
      });

    console.log("Found orders:", orders);

    res.status(200).json({
      success: true,
      orders: orders,
      message: orders.length ? null : "No orders found",
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

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

    const order = await Order.findOne({ _id: id, "user._id": userId })
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

    const order = await Order.findOne({ _id: id, "user._id": userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

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

const cancelOrder = async (req, res) => {
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

    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be cancelled",
      });
    }

    order.status = "cancelled";
    await order.save();

    const updatedOrder = await Order.findById(id)
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
      message: "Order cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};

const getVendorOrders = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const decoded = verifyToken(token);
    const vendorId = decoded.id;

    const orders = await Order.find({ vendor: vendorId })
      .sort({ createdAt: -1 })
      .populate("address")
      .populate("user", "name email")
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
    console.error("Error fetching vendor orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vendor orders",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getVendorOrders,
};
