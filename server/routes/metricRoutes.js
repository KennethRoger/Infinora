const express = require("express");
const router = express.Router();
const {
  getSalesReport,
  getAdminSalesReport,
  getProductPerformance,
  getSalesAndOrdersMetrics,
  getAdminRevenueMetrics,
  getUserActivityMetrics,
  getBestSellingProducts,
  getBestSellingCategories
} = require("../controllers/metricController");
const { authorizeUser } = require("../middlewares/authenticate");

router.get("/vendor/sales-report", authorizeUser(["vendor", "admin"]), getSalesReport);
router.get("/admin/sales-report", authorizeUser(["admin", "vendor"]), getAdminSalesReport);
router.get("/vendor/product-performance", authorizeUser(["vendor", "admin"]), getProductPerformance);
router.get("/vendor/sales-and-orders", authorizeUser(["vendor", "admin"]), getSalesAndOrdersMetrics);
router.get("/admin/revenue", authorizeUser(["admin", "vendor"]), getAdminRevenueMetrics);
router.get("/admin/user-activity", authorizeUser(["admin", "vendor"]), getUserActivityMetrics);
router.get("/vendor/best-selling-products", authorizeUser(["vendor", "admin"]), getBestSellingProducts);
router.get("/admin/best-selling-categories", authorizeUser(["vendor", "admin"]), getBestSellingCategories);

module.exports = router;
