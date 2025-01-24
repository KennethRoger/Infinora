const express = require("express");
const router = express.Router();
const {
  createTempOrder,
  getTempOrderById,
  getUserTempOrders,
  deleteTempOrder
} = require("../controllers/tempOrderController");
const { authorizeUser } = require("../middlewares/authenticate");

router.post("/", authorizeUser(["user", "vendor", "admin"]), createTempOrder);
router.get("/", authorizeUser(["user", "vendor", "admin"]), getUserTempOrders);
router.get("/:id", authorizeUser(["user", "vendor", "admin"]), getTempOrderById);
router.delete("/:id", authorizeUser(["user", "vendor", "admin"]), deleteTempOrder);

module.exports = router;
