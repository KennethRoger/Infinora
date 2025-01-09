const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variants: {
      type: Object,
      default: {},
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    appliedCoupon: {
      couponCode: String,
      couponDiscount: Number,
      variants: Object,
    },
    shippingAddress: {
      type: Object,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cod", "online", "wallet"],
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["pending", "verified", "completed", "failed"],
      default: "pending"
    },
    razorpay: {
      orderId: String,
      paymentId: String,
      signature: String,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
