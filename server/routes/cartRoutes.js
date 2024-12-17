const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  incrementCartItem,
  decrementCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

router.post("/add", addToCart);
router.get("/get", getCart);
router.post("/increment", incrementCartItem);
router.post("/decrement", decrementCartItem);
router.post("/remove", removeFromCart);
router.delete("/clear", clearCart);

module.exports = router;
