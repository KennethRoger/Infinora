const express = require("express");
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

router.route("/").post(createOrder).get(getUserOrders);

router.route("/:id").get(getOrderById).patch(updateOrderStatus);

module.exports = router;