const express = require('express');
const router = express.Router();
const {
  getStorePerformance,
  getFinancialAnalytics,
  getSalesReport,
  getAdminSalesReport,
} = require('../controllers/metricController');

router.get('/vendor/store-performance', getStorePerformance);
router.get('/vendor/financial-analytics', getFinancialAnalytics);
router.get('/vendor/sales-report', getSalesReport);
router.get('/admin/sales-report', getAdminSalesReport);

module.exports = router;