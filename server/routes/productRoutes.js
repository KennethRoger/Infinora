const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getVendorProducts,
  getProductById,
  toggleProductListing
} = require("../controllers/productController");

router.get("/all", getAllProducts);
router.get("/vendor", getVendorProducts);
router.get("/:productId", getProductById);

router.patch("/toggle-listing", toggleProductListing);

module.exports = router;