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
const { authorizeUser } = require("../middlewares/authenticate");

router.post("/", authorizeUser(["user", "vendor", "admin"]), createOrder);
router.get("/", authorizeUser(["user", "vendor", "admin"]), getUserOrders);
router.get("/vendor", authorizeUser(["user", "vendor", "admin"]), getVendorOrders);
router.get("/all", authorizeUser(["user", "vendor", "admin"]), getAllOrders);
router.get("/invoice/:orderId", authorizeUser(["user", "vendor", "admin"]), getOrderForInvoice);
router.get("/:id", authorizeUser(["user", "vendor", "admin"]), getOrderById);
router.patch("/:id/status", authorizeUser(["vendor", "admin"]), updateOrderStatus);
router.patch("/:id/cancel", authorizeUser(["user", "vendor", "admin"]), cancelOrder);
router.patch("/:id/return", authorizeUser(["user", "vendor", "admin"]), returnOrder);
router.patch("/:id/cancel-return", authorizeUser(["user", "vendor", "admin"]), cancelReturnRequest);
router.patch("/vendor/:id/accept-return", authorizeUser(["user", "vendor", "admin"]), acceptReturnOrder);
router.patch("/admin/:id/cancel", authorizeUser(["admin"]), adminCancelOrder);
router.patch("/admin/:orderId/confirm-delivered", authorizeUser(["admin"]), confirmDelivered);

module.exports = router;
