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

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const orders = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).populate("vendor");
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      // Validate variants first
      if (product.variants?.length > 0 && item.variants) {
        // Validate all variants exist
        for (const [variantName, typeName] of Object.entries(item.variants)) {
          const variant = product.variants.find(
            (v) => v.variantName === variantName
          );
          if (!variant) {
            throw new Error(`Variant not found: ${variantName}`);
          }

          const variantType = variant.variantTypes.find(
            (t) => t.name === typeName
          );
          if (!variantType) {
            throw new Error(
              `Variant type not found for ${variantName}: ${typeName}`
            );
          }
        }

        // Check and update stock once
        const matchingCombination = product.variantCombinations.find(
          (combo) => {
            return Object.entries(combo.variants).every(
              ([key, value]) => item.variants[key] === value
            );
          }
        );

        console.log("Checking stock for combination:", matchingCombination);

        if (!matchingCombination) {
          throw new Error(`Invalid variant combination for product ${product.name}`);
        }

        if (matchingCombination.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for variant combination in ${product.name}. Available: ${matchingCombination.stock}, Requested: ${item.quantity}`
          );
        }

        // Update stock once
        const updatedCombinations = product.variantCombinations.map((combo) => {
          const isMatchingCombo = Object.entries(combo.variants).every(
            ([key, value]) => item.variants[key] === value
          );

          if (isMatchingCombo) {
            return {
              ...combo,
              stock: combo.stock - item.quantity,
            };
          }
          return combo;
        });

        product.variantCombinations = updatedCombinations;
        await product.save();
        console.log("Updated stock for variant combination");
      } else {
        if (product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
          );
        }

        product.stock -= item.quantity;
        await product.save();
        console.log("Updated stock for regular product");
      }

      let basePrice = product.price;
      if (item.variants) {
        for (const [variantName, typeName] of Object.entries(item.variants)) {
          const variant = product.variants.find(
            (v) => v.variantName === variantName
          );
          const variantType = variant.variantTypes.find(
            (t) => t.name === typeName
          );
          if (variantType?.price) {
            basePrice += variantType.price;
          }
        }
      }

      const totalAmount = basePrice * (1 - product.discount / 100) * item.quantity;

      const orderId = generateOrderId(userId);

      const order = await Order.create({
        orderId,
        user: userId,
        product: item.productId,
        variants: item.variants,
        quantity: item.quantity,
        price: basePrice,
        discount: product.discount,
        address: addressId,
        paymentMethod,
        vendor: product.vendor._id,
        totalAmount,
        status: "pending",
      });

      orders.push(order);
    }

    const populatedOrders = await Order.find({
      _id: { $in: orders.map((order) => order._id) },
    })
      .populate("address")
      .populate({
        path: "product",
        select: "name images variants variantCombinations price",
        populate: {
          path: "vendor",
          select: "name",
        },
      });

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
        select: "name images variants variantCombinations price",
        populate: {
          path: "vendor",
          select: "name",
        },
      });

    res.status(200).json({
      success: true,
      orders: orders,
      message: orders.length ? null : "No orders found",
    });
  } catch (error) {
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

    const order = await Order.findOne({ _id: id, user: userId })
      .populate("address")
      .populate({
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

    if (status === "shipped") {
      console.log(`Updating order ${id} to shipped status`);
    }

    // Update the order status
    order.status = status;
    const updatedOrder = await order.save();

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Failed to update order status",
      });
    }

    // Populate necessary fields
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
        message: "Unauthorized access",
      });
    }

    const decoded = verifyToken(token);
    const vendorId = decoded.id;

    const orders = await Order.find({ vendor: vendorId })
      .sort({ createdAt: -1 })
      .populate("address")
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
      orders,
      message: orders.length ? null : "No orders found",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
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
