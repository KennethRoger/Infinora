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
const { authorizeUser } = require("../middlewares/authenticate");

router.post("/add", authorizeUser(["user", "vendor"]), addToCart);
router.get("/get", authorizeUser(["user", "vendor"]), getCart);
router.post("/increment", authorizeUser(["user", "vendor"]), incrementCartItem);
router.post("/decrement", authorizeUser(["user", "vendor"]), decrementCartItem);
router.post("/remove", authorizeUser(["user", "vendor"]), removeFromCart);
router.delete("/clear", authorizeUser(["user", "vendor"]), clearCart);

module.exports = router;
