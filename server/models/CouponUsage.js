const mongoose = require("mongoose");

const couponUsageSchema = new mongoose.Schema(
  {
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    usageCount: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

// Compound index to efficiently query by both couponId and userId
couponUsageSchema.index({ couponId: 1, userId: 1 }, { unique: true });

const CouponUsage = mongoose.model("CouponUsage", couponUsageSchema);
module.exports = CouponUsage;
