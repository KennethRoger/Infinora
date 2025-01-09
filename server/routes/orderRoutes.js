const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getVendorOrders,
  getAllOrders,
  adminCancelOrder,
  confirmDelivered,
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/vendor", getVendorOrders);
router.get("/all", getAllOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);
router.patch("/:id/cancel", cancelOrder);
router.patch("/admin/:id/cancel", adminCancelOrder);
router.patch("/admin/:orderId/confirm-delivered", confirmDelivered);

module.exports = router;
