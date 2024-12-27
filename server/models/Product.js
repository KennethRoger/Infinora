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
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  imageIndex: { type: Number, required: false },
  shipping: { type: shippingSchema, required: false },
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

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: { type: String },
  rating: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    productVariants: {
      type: [productVariantsSchema],
      default: [],
    },
    price: { type: Number },
    stock: { type: Number },
    shipping: { type: shippingSchema },
    discount: { type: Number, default: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    rating: { type: Number, default: 0 },
    reviews: { type: [reviewSchema], required: false },
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
