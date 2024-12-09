const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    variant: { type: String, default: "default" },
    price: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    rating: { type: Number, default: 0 },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String },
        rating: { type: Number },
      },
    ],
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
    isListed: { type: Boolean, default: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tags: { type: [String], default: [] },
    brand: { type: String, default: null },
    salesCount: { type: Number, default: 0 },
    shipping: {
      weight: { type: Number },
      dimensions: { type: String },
    },
    taxRate: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    customizationOptions: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
