const express = require('express');
const router = express.Router();
const {
  getSalesReport,
  getAdminSalesReport,
  getProductPerformance,
  getSalesAndOrdersMetrics,
  getAdminRevenueMetrics,
  getUserActivityMetrics
} = require('../controllers/metricController');

router.get('/vendor/sales-report', getSalesReport);
router.get('/admin/sales-report', getAdminSalesReport);
router.get('/vendor/product-performance', getProductPerformance);
router.get('/vendor/sales-and-orders', getSalesAndOrdersMetrics);
router.get('/admin/revenue', getAdminRevenueMetrics);
router.get('/admin/user-activity', getUserActivityMetrics);

module.exports = router;