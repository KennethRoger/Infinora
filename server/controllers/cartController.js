const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { verifyToken } = require("../utils/tokenValidator");

const addToCart = async (req, res) => {
  try {
    const { productId, selectedVariant, quantity } = req.body;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    const decoded = verifyToken(token);
    const userId = decoded.id;

    if (quantity !== 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be 1 for adding to cart",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const variant = product.variant?.variantTypes[selectedVariant];
    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Invalid variant selected",
      });
    }

    if (variant.stock < 1) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.selectedVariant === selectedVariant
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > 5) {
        return res.status(400).json({
          success: false,
          message: "Cannot exceed maximum quantity of 5 per item",
        });
      }
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        product: productId,
        selectedVariant,
        quantity,
      });
    }

    await cart.save();

    await cart.populate({
      path: "items.product",
      select: "name images variant vendor discount",
      populate: {
        path: "vendor",
        select: "name profileImagePath",
      },
    });

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: "Error adding item to cart",
      error: error.message,
    });
  }
};

const getCart = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    const decoded = verifyToken(token);
    const userId = decoded.id;

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "name images variant vendor discount",
      populate: {
        path: "vendor",
        select: "name profileImagePath",
      },
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [] },
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId, selectedVariant } = req.body;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    const decoded = verifyToken(token);
    const userId = decoded.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.selectedVariant === selectedVariant
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    await cart.populate({
      path: "items.product",
      select: "name images variant vendor discount",
      populate: {
        path: "vendor",
        select: "name profileImagePath",
      },
    });

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({
      success: false,
      message: "Error removing cart item",
      error: error.message,
    });
  }
};

const incrementCartItem = async (req, res) => {
  try {
    const { productId, selectedVariant } = req.body;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    const decoded = verifyToken(token);
    const userId = decoded.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.selectedVariant === selectedVariant
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    if (cart.items[itemIndex].quantity >= 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum quantity limit reached",
      });
    }

    cart.items[itemIndex].quantity += 1;
    await cart.save();

    await cart.populate({
      path: "items.product",
      select: "name images variant vendor discount",
      populate: {
        path: "vendor",
        select: "name profileImagePath",
      },
    });

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error incrementing cart item:", error);
    res.status(500).json({
      success: false,
      message: "Error incrementing cart item",
      error: error.message,
    });
  }
};

const decrementCartItem = async (req, res) => {
  try {
    const { productId, selectedVariant } = req.body;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    const decoded = verifyToken(token);
    const userId = decoded.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.selectedVariant === selectedVariant
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    if (cart.items[itemIndex].quantity <= 1) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity -= 1;
    }

    await cart.save();

    await cart.populate({
      path: "items.product",
      select: "name images variant vendor discount",
      populate: {
        path: "vendor",
        select: "name profileImagePath",
      },
    });

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Error decrementing cart item:", error);
    res.status(500).json({
      success: false,
      message: "Error decrementing cart item",
      error: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  incrementCartItem,
  decrementCartItem,
  removeFromCart,
};
