const express = require("express");
const router = express.Router();
const {
  createTempOrder,
  getTempOrderById,
  getUserTempOrders,
  deleteTempOrder
} = require("../controllers/tempOrderController");

router.post("/", createTempOrder);
router.get("/", getUserTempOrders);
router.get("/:id", getTempOrderById);
router.delete("/:id", deleteTempOrder);

module.exports = router;
