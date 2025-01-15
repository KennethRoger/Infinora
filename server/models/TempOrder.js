const mongoose = require("mongoose");

const tempOrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variants: {
    type: Map,
    of: String,
    default: undefined,
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
});

const tempOrderSchema = new mongoose.Schema(
  {
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    items: [tempOrderItemSchema],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shippingAddress: {
      type: Object,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    appliedCoupons: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      couponCode: String,
      couponDiscount: Number,
      variants: Object,
    }],
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400,
    },
  },
  { timestamps: true }
);

tempOrderSchema.index({ userId: 1, status: 1 });
tempOrderSchema.index({ razorpayOrderId: 1 });

module.exports = mongoose.model("TempOrder", tempOrderSchema);
