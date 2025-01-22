const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({
  weight: { type: String, required: true },
  dimensions: {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
});

const variantTypesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageIndex: { type: Number },
});

const variantCombinationSchema = new mongoose.Schema({
  variants: {
    type: Object,
    required: true,
  },
  stock: { type: Number, required: true },
  priceAdjustment: { type: Number, default: 0 },
});

const productVariantsSchema = new mongoose.Schema({
  variantName: {
    type: String,
    required: true,
  },
  variantTypes: {
    type: [variantTypesSchema],
    required: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    variants: {
      type: [productVariantsSchema],
      default: [],
    },
    variantCombinations: {
      type: [variantCombinationSchema],
      default: [],
    },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    shipping: { type: shippingSchema },
    discount: { type: Number, default: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    rating: { type: Number, default: 0 },
    additionalDetails: { type: String, default: "" },
    status: {
      type: String,
      enum: ["available", "outOfStock", "comingSoon"],
      default: "available",
    },
    isListed: { type: Boolean, default: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tags: { type: [String], default: [] },
    salesCount: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    customizable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
