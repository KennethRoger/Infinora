const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    // Should the discount be percentage type value or a fixed type value
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    // the purchase criteria needed for the coupon to be applicable
    minimumAmount: {
      type: Number,
      default: null,
    },
    // The dicount cap amount to limit the purchases
    maximumDiscountAmount: {
      type: Number,
      default: null,
    },
    // Which vendor made the coupon
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Restriction on user about the usage of the coupon
    userRestriction: {
      newUsersOnly: {
        type: Boolean,
        default: false,
      },
      maxUsesPerUser: {
        type: Number,
        default: 1,
      },
    },
    // The total number of times the coupon has been used
    totalUses: {
      type: Number,
      default: 0,
    },
    // The maximum number of times the coupon can be used in platform as a whole
    maxUses: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

couponSchema.index({ code: 1 });

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
