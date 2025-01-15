const express = require("express");
const router = express.Router();
const {
  createTempOrder,
  getTempOrderById,
  getUserTempOrders,
} = require("../controllers/tempOrderController");

router.post("/", createTempOrder);
router.get("/", getUserTempOrders);
router.get("/:id", getTempOrderById);

module.exports = router;
