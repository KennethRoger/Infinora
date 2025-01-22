const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    review: {
      type: String,
      required: true,
      trim: true,
      maxLength: 1000,
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isEdited: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ user: 1, product: 1 }, { unique: true });
reviewSchema.index({ product: 1, createdAt: -1 });

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
