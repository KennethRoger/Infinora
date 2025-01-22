const Product = require("../models/Product");
const { verifyToken } = require("../utils/tokenValidator");

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments({ isListed: true });
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find({ isListed: true })
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("vendor", "name email profileImagePath")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasMore: page < totalPages,
      },
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments({ vendor: vendorId });
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find({ vendor: vendorId })
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("vendor", "name email profileImagePath")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasMore: page < totalPages,
      },
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
