const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { verifyToken } = require("../utils/tokenValidator");

const addToCart = async (req, res) => {
  try {
    const { productId, variants, quantity = 1 } = req.body;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to add items to cart",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex((item) => {
      if (item.productId.toString() !== productId) return false;

      if (!variants && !item.variants) return true;
      if (!variants || !item.variants) return false;

      const itemVariants = item.variants instanceof Map
        ? Object.fromEntries(item.variants)
        : item.variants;

      if (Object.keys(variants).length !== Object.keys(itemVariants).length)
        return false;

      return Object.entries(variants).every(
        ([key, value]) => itemVariants[key] === value
      );
    });

    const currentQuantity =
      existingItemIndex > -1 ? cart.items[existingItemIndex].quantity : 0;
    const newTotalQuantity = currentQuantity + quantity;

    if (newTotalQuantity > 5) {
      return res.status(400).json({
        success: false,
        message: "Cannot add more than 5 quantities of the same product",
      });
    }

    if (product.variants?.length > 0) {
      if (
        !variants ||
        Object.keys(variants).length !== product.variants.length
      ) {
        return res.status(400).json({
          success: false,
          message: "Please select all variants",
        });
      }

      const matchingCombination = product.variantCombinations.find((combo) => {
        return Object.entries(variants).every(
          ([key, val]) => combo.variants[key] === val
        );
      });

      if (!matchingCombination) {
        return res.status(400).json({
          success: false,
          message: "This combination is not available",
        });
      }

      if (matchingCombination.stock < newTotalQuantity) {
        return res.status(400).json({
          success: false,
          message: "Selected combination is out of stock",
        });
      }
    } else {
      if (product.stock < newTotalQuantity) {
        return res.status(400).json({
          success: false,
          message: "Product is out of stock",
        });
      }
    }

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity = newTotalQuantity;
      if (variants) {
        cart.items[existingItemIndex].variants = variants;
      }
    } else {
      cart.items.push({
        productId,
        variants,
        quantity,
      });
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
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

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "name images variants variantCombinations price stock vendor discount",
      populate: {
        path: "vendor",
        select: "name profileImagePath",
      },
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { userId, items: [] },
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
      message: "Failed to fetch cart",
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId, variants } = req.body;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    const decoded = verifyToken(token);
    const userId = decoded.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex((item) => {
      if (item.productId.toString() !== productId) return false;

      if (!variants && !item.variants) return true;
      if (!variants || !item.variants) return false;

      const itemVariants = item.variants instanceof Map
        ? Object.fromEntries(item.variants)
        : item.variants;

      if (Object.keys(variants).length !== Object.keys(itemVariants).length)
        return false;

      return Object.entries(variants).every(
        ([key, value]) => itemVariants[key] === value
      );
    });

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "name images variants variantCombinations price stock vendor discount",
      populate: {
        path: "vendor",
        select: "name profileImagePath",
      },
    });

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
    });
  }
};

const incrementCartItem = async (req, res) => {
  try {
    const { productId, variants } = req.body;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    const decoded = verifyToken(token);
    const userId = decoded.id;

    const [cart, product] = await Promise.all([
      Cart.findOne({ userId }),
      Product.findById(productId)
    ]);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const itemIndex = cart.items.findIndex((item) => {
      if (item.productId.toString() !== productId) return false;

      if (!variants && !item.variants) return true;
      if (!variants || !item.variants) return false;

      const itemVariants = item.variants instanceof Map
        ? Object.fromEntries(item.variants)
        : item.variants;

      if (Object.keys(variants).length !== Object.keys(itemVariants).length)
        return false;

      return Object.entries(variants).every(
        ([key, value]) => itemVariants[key] === value
      );
    });

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    if (cart.items[itemIndex].quantity >= 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum quantity limit reached (5 items)",
      });
    }

    if (product.variants?.length > 0) {
      if (variants) {
        const matchingCombination = product.variantCombinations.find((combo) => {
          return Object.entries(variants).every(
            ([key, val]) => combo.variants[key] === val
          );
        });

        if (!matchingCombination || matchingCombination.stock <= cart.items[itemIndex].quantity) {
          return res.status(400).json({
            success: false,
            message: "Selected combination is out of stock",
          });
        }
      }
    } else if (product.stock <= cart.items[itemIndex].quantity) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    cart.items[itemIndex].quantity += 1;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "name images variants variantCombinations price stock vendor discount",
      populate: {
        path: "vendor",
        select: "name profileImagePath",
      },
    });

    res.status(200).json({
      success: true,
      message: "Item quantity increased",
      cart,
    });
  } catch (error) {
    console.error("Error incrementing cart item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to increase item quantity",
    });
  }
};

const decrementCartItem = async (req, res) => {
  try {
    const { productId, variants } = req.body;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    const decoded = verifyToken(token);
    const userId = decoded.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex((item) => {
      if (item.productId.toString() !== productId) return false;

      if (!variants && !item.variants) return true;
      if (!variants || !item.variants) return false;

      const itemVariants = item.variants instanceof Map
        ? Object.fromEntries(item.variants)
        : item.variants;

      if (Object.keys(variants).length !== Object.keys(itemVariants).length)
        return false;

      return Object.entries(variants).every(
        ([key, value]) => itemVariants[key] === value
      );
    });

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
      path: "items.productId",
      select: "name images variants variantCombinations price stock vendor discount",
      populate: {
        path: "vendor",
        select: "name profileImagePath",
      },
    });

    res.status(200).json({
      success: true,
      message: itemIndex < cart.items.length ? "Item quantity decreased" : "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Error decrementing cart item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to decrease item quantity",
    });
  }
};

const clearCart = async (req, res) => {
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

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { items: [] },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({
      success: false,
      message: "Error clearing cart",
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  incrementCartItem,
  decrementCartItem,
  removeFromCart,
  clearCart,
};
