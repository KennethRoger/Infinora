const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  incrementCartItem,
  decrementCartItem,
  removeFromCart,
} = require("../controllers/cartController");

router.post("/add", addToCart);
router.get("/get", getCart);
router.post("/increment", incrementCartItem);
router.post("/decrement", decrementCartItem);
router.post("/remove", removeFromCart);

module.exports = router;
