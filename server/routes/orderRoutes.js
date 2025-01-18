const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  returnOrder,
  cancelReturnRequest,
  getVendorOrders,
  getAllOrders,
  adminCancelOrder,
  confirmDelivered,
  acceptReturnOrder,
  getOrderForInvoice,
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/vendor", getVendorOrders);
router.get("/all", getAllOrders);
// Invoice route should be before the ID route
router.get("/invoice/:orderId", getOrderForInvoice);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);
router.patch("/:id/cancel", cancelOrder);
router.patch("/:id/return", returnOrder);
router.patch("/:id/cancel-return", cancelReturnRequest);
router.patch("/vendor/:id/accept-return", acceptReturnOrder);
router.patch("/admin/:id/cancel", adminCancelOrder);
router.patch("/admin/:orderId/confirm-delivered", confirmDelivered);

module.exports = router;
