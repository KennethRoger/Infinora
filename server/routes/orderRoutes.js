const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");


router.route("/").post(createOrder).get(getUserOrders);

router.route("/:id").get(getOrderById).patch(updateOrderStatus);

module.exports = router;