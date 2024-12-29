const mongoose = require("mongoose");

const variantSelectionSchema = new mongoose.Schema({
  variantName: {
    type: String,
    required: true
  },
  typeName: {
    type: String,
    required: true
  }
});

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  selectedVariants: {
    type: [variantSelectionSchema],
    default: undefined
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
