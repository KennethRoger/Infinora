const Product = require("../models/Product");
const { verifyToken } = require("../utils/tokenValidator");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isListed: true })
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("vendor", "name email profileImagePath")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("vendor", "name email profileImagePath");
      console.log(product)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product details",
      error: error.message,
    });
  }
};

const getVendorProducts = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });

    const decoded = verifyToken(token);
    const vendorId = decoded.id;

    const products = await Product.find({ vendor: vendorId })
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("vendor", "name email profileImagePath")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching vendor products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

const toggleProductListing = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isListed = !product.isListed;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${
        product.isListed ? "listed" : "unlisted"
      } successfully`,
      product,
    });
  } catch (error) {
    console.error("Error toggling product listing:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product listing status",
      error: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getVendorProducts,
  getProductById,
  toggleProductListing,
};
