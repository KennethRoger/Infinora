const Order = require("../models/Order");
const Product = require("../models/Product");
const { verifyToken } = require("../utils/tokenValidator");
const { generateOrderId } = require("../utils/generateOrderId");
const Address = require("../models/Address");
const createWalletTransaction = require("../utils/walletUtils");
const User = require("../models/User");

const createOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod, items, appliedCoupons, paymentDetails } =
      req.body;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to place order",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const shippingAddress = await Address.findById(addressId);
    if (!shippingAddress) {
      return res.status(404).json({
        success: false,
        message: "Shipping address not found",
      });
    }

    const orders = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).populate("vendor");
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      if (product.variants?.length > 0 && item.variants) {
        const matchingCombination = product.variantCombinations.find((combo) =>
          Object.entries(combo.variants).every(
            ([key, value]) => item.variants[key] === value
          )
        );

        if (!matchingCombination) {
          throw new Error(
            `Invalid variant combination for product ${product.name}`
          );
        }

        if (matchingCombination.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${product.name} with selected variants. Available: ${matchingCombination.stock}, Requested: ${item.quantity}`
          );
        }

        const updatedCombinations = product.variantCombinations.map((combo) => {
          if (
            Object.entries(combo.variants).every(
              ([key, value]) => item.variants[key] === value
            )
          ) {
            return {
              ...combo,
              stock: combo.stock - item.quantity,
            };
          }
          return combo;
        });

        product.variantCombinations = updatedCombinations;
      } else {
        if (product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
          );
        }
        product.stock -= item.quantity;
      }

      let basePrice = product.price;

      if (item.variants && product.variantCombinations?.length > 0) {
        const matchingCombination = product.variantCombinations.find((combo) =>
          Object.entries(combo.variants).every(
            ([key, value]) => item.variants[key] === value
          )
        );
        if (matchingCombination) {
          basePrice += matchingCombination.priceAdjustment || 0;
        }
      }

      const itemTotal = basePrice * item.quantity;
      const productDiscount = (itemTotal * (product.discount || 0)) / 100;

      const appliedCoupon = appliedCoupons?.find(
        (c) => c.productId === item.productId
      );
      const couponDiscount = appliedCoupon?.couponDiscount || 0;

      const finalAmount = itemTotal - productDiscount - couponDiscount;

      const orderId = generateOrderId(userId);

      const order = await Order.create({
        orderId,
        user: userId,
        product: item.productId,
        variants: item.variants || {},
        quantity: item.quantity,
        price: basePrice,
        discount: product.discount || 0,
        appliedCoupon: appliedCoupon
          ? {
              couponCode: appliedCoupon.couponCode,
              couponDiscount: appliedCoupon.couponDiscount,
              variants: appliedCoupon.variants,
            }
          : undefined,
        shippingAddress: {
          name: shippingAddress.name,
          phone: shippingAddress.phone,
          address: shippingAddress.address,
          locality: shippingAddress.locality,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
          type: shippingAddress.type,
        },
        paymentMethod,
        vendor: product.vendor._id,
        totalAmount: itemTotal, // Subtotal (price * quantity)
        productDiscount: productDiscount, // Product discount amount
        finalAmount: finalAmount, // Final amount after all discounts
        status: "pending",
        paymentStatus: paymentMethod === "cod" ? "pending" : "verified",
        ...(paymentMethod === "online" &&
          paymentDetails && {
            razorpay: {
              orderId: paymentDetails.orderId,
              paymentId: paymentDetails.paymentId,
              signature: paymentDetails.signature,
            },
          }),
      });

      await product.save();
      orders.push(order);
    }

    const populatedOrders = await Order.find({
      _id: { $in: orders.map((order) => order._id) },
    }).populate({
      path: "product",
      select: "name images variants price",
      populate: {
        path: "vendor",
        select: "name",
      },
    });

    res.status(201).json({
      success: true,
      message: "Orders created successfully",
      orders: populatedOrders,
    });
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

const getUserOrders = async (req, res) => {
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments({ user: userId });
    const totalPages = Math.ceil(totalOrders / limit);

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "product",
        select: "name images variants variantCombinations price",
        populate: {
          path: "vendor",
          select: "name",
        },
      });

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error in getUserOrders:", error);
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
        message: "Please login to view order details",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const order = await Order.findOne({ _id: id, user: userId }).populate({
      path: "product",
      select: "name images variants variantCombinations price",
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
    console.error("Error in getOrderById:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
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
    const vendorId = decoded.id;

    const order = await Order.findOne({ _id: id, vendor: vendorId }).populate({
      path: "product",
      select: "variants variantCombinations stock",
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status === "cancelled" || order.status === "delivered") {
      return res.status(400).json({
        success: false,
        message: `Cannot update ${order.status} order`,
      });
    }

    order.status = status;
    const updatedOrder = await order.save();

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Failed to update order status",
      });
    }

    await updatedOrder.populate("product");

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

    const order = await Order.findOne({ _id: id, user: userId }).populate(
      "product"
    );
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!["pending", "processing"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order in current status",
      });
    }

    const product = await Product.findById(order.product);

    if (order.variants) {
      const updatedCombinations = product.variantCombinations.map((combo) => {
        if (
          Object.entries(combo.variants).every(
            ([key, value]) => order.variants[key] === value
          )
        ) {
          return {
            ...combo,
            stock: combo.stock + order.quantity,
          };
        }
        return combo;
      });

      product.variantCombinations = updatedCombinations;
    } else {
      product.stock += order.quantity;
    }

    await product.save();

    if (order.paymentMethod !== "cod") {
      await createWalletTransaction({
        userId,
        amount: order.finalAmount,
        type: "credit",
        description: `Refund for order #${order.orderId}`,
        reference: `refund_${order._id}`,
        paymentMethod: "refund",
        orderId: order._id,
      });
    }

    order.status = "cancelled";
    await order.save();

    const updatedOrder = await Order.findById(id).populate({
      path: "product",
      select: "name images variants variantCombinations price",
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
        message: "Please login to view orders",
      });
    }

    const decoded = verifyToken(token);
    const vendorId = decoded.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments({ vendor: vendorId });
    const totalPages = Math.ceil(totalOrders / limit);

    const orders = await Order.find({ vendor: vendorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "product",
        select: "name images variants variantCombinations price",
        populate: {
          path: "vendor",
          select: "name",
        },
      })
      .populate("user", "name email")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to view orders",
      });
    }

    const decoded = verifyToken(token);
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view all orders",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();
    const totalPages = Math.ceil(totalOrders / limit);

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "product",
        select: "name images variants variantCombinations price",
        populate: {
          path: "vendor",
          select: "name",
        },
      })
      .populate("user", "name email")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

const adminCancelOrder = async (req, res) => {
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
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel orders",
      });
    }

    const order = await Order.findById(id).populate("product user");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (["completed", "cancelled"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order in current status",
      });
    }

    const product = await Product.findById(order.product);
    if (!product || product.vendor.toString() !== decoded.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel orders for this product",
      });
    }

    if (order.variants) {
      const updatedCombinations = product.variantCombinations.map((combo) => {
        if (
          Object.entries(combo.variants).every(
            ([key, value]) => order.variants[key] === value
          )
        ) {
          return {
            ...combo,
            stock: combo.stock + order.quantity,
          };
        }
        return combo;
      });

      product.variantCombinations = updatedCombinations;
    } else {
      product.stock += order.quantity;
    }

    await product.save();

    if (order.paymentMethod !== "cod") {
      await createWalletTransaction({
        userId: order.user._id,
        amount: order.finalAmount,
        type: "credit",
        description: `Admin cancelled order #${order.orderId} - Refund issued`,
        reference: `admin_refund_${order._id}`,
        paymentMethod: "refund",
        orderId: order._id,
      });
    }

    order.status = "cancelled";
    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate({
        path: "product",
        select: "name images variants variantCombinations price",
        populate: {
          path: "vendor",
          select: "name",
        },
      })
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully by admin",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error in admin cancel order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};

const confirmDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate({
      path: "vendor",
      model: "User",
      select: "_id",
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.status !== "delivered") {
      return res.status(400).json({
        success: false,
        message: "Order must be in shipped state to confirm delivery",
      });
    }

    order.paymentStatus = "completed";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order delivered and payment completed",
      data: { order },
    });
  } catch (error) {
    console.error("Error in confirmDelivered:", error);
    res.status(500).json({
      success: false,
      message: "Error confirming delivery",
      error: error.message,
    });
  }
};

const returnOrder = async (req, res) => {
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
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== decoded.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to return this order",
      });
    }

    if (order.status !== "delivered") {
      return res.status(400).json({
        success: false,
        message: "Order must be delivered before it can be returned",
      });
    }

    order.status = "return_requested";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Return request submitted successfully",
      order,
    });
  } catch (error) {
    console.error("Error in returnOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process return request",
    });
  }
};

const cancelReturnRequest = async (req, res) => {
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
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== decoded.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel return request for this order",
      });
    }

    if (order.status !== "return_requested") {
      return res.status(400).json({
        success: false,
        message: "Order is not in return requested state",
      });
    }

    order.status = "delivered";
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Return request cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Error in cancelReturnRequest:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel return request",
      error: error.message,
    });
  }
};

const acceptReturnOrder = async (req, res) => {
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
    if (decoded.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to accept returns",
      });
    }

    const order = await Order.findById(id).populate("user");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const product = await Product.findById(order.product);
    if (!product || product.vendor.toString() !== decoded.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to accept returns for this product",
      });
    }

    if (order.status !== "return_requested") {
      return res.status(400).json({
        success: false,
        message: "Order is not in return requested state",
      });
    }

    try {
      if (product.variants?.length > 0 && order.variants) {
        const updatedCombinations = product.variantCombinations.map((combo) => {
          if (
            Object.entries(combo.variants).every(
              ([key, value]) => order.variants[key] === value
            )
          ) {
            return {
              ...combo,
              stock: combo.stock + order.quantity,
            };
          }
          return combo;
        });
        product.variantCombinations = updatedCombinations;
      } else {
        product.stock += order.quantity;
      }
      await product.save();

      const refundAmount = order.finalAmount;
      await createWalletTransaction({
        userId: order.user._id,
        amount: refundAmount,
        type: "credit",
        description: `Refund for order ${order.orderId}`,
        reference: "order_return",
        paymentMethod: "refund",
        orderId: order._id,
      });

      order.status = "returned";
      await order.save();

      return res.status(200).json({
        success: true,
        message: "Return accepted and refund processed",
        order,
      });
    } catch (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error in acceptReturnOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process return",
      error: error.message,
    });
  }
};

const getOrderForInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId })
      .populate("user", "name email phoneNumber")
      .populate({
        path: "vendor",
        model: "User",
        select: "name email phoneNumber",
      })
      .populate({
        path: "product",
        select: "name description images price variants category subCategory",
      });

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  returnOrder,
  cancelReturnRequest,
  getVendorOrders,
  getAllOrders,
  adminCancelOrder,
  confirmDelivered,
  acceptReturnOrder,
  getOrderForInvoice,
};
