const mongoose = require("mongoose");

const shippingSchema = new mongoose.Schema({
  weight: { type: String, required: true },
  dimensions: {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
});

const variantTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  imageIndex: { type: Number },
  stock: { type: Number, required: true },
  shipping: { type: shippingSchema, required: true },
});

const productVariantSchema = new mongoose.Schema({
  variantName: { type: String, required: true },
  variantTypes: {
    type: [variantTypeSchema],
    required: true,
    validate: {
      validator: function (types) {
        return types.length > 0 && types.length <= 5;
      },
      message: "Must have at least 1 and no more than 5 variant types",
    },
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
    variant: {
      type: productVariantSchema,
      required: true,
    },
    discount: { type: Number, default: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
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
    customizationOptions: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
