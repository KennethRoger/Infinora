const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { verifyToken } = require("../utils/tokenValidator");

const addToCart = async (req, res) => {
  try {
    const { productId, selectedVariants, quantity } = req.body;
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
      if (product.productVariants && product.productVariants.length > 0) {
        if (item.productId.toString() !== productId) return false;
        if (
          !item.selectedVariants ||
          item.selectedVariants.length !== selectedVariants.length
        )
          return false;

        return selectedVariants.every((variant) =>
          item.selectedVariants.some(
            (itemVariant) =>
              itemVariant.variantName === variant.variantName &&
              itemVariant.typeName === variant.typeName
          )
        );
      } else {
        return item.productId.toString() === productId;
      }
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

    if (product.productVariants && product.productVariants.length > 0) {
      if (
        !selectedVariants ||
        selectedVariants.length !== product.productVariants.length
      ) {
        return res.status(400).json({
          success: false,
          message: "Please select all variants",
        });
      }

      for (const variant of selectedVariants) {
        const productVariant = product.productVariants.find(
          (v) => v.variantName === variant.variantName
        );
        if (!productVariant) {
          return res.status(400).json({
            success: false,
            message: `Invalid variant: ${variant.variantName}`,
          });
        }

        const variantType = productVariant.variantTypes.find(
          (t) => t.name === variant.typeName
        );
        if (!variantType) {
          return res.status(400).json({
            success: false,
            message: `Invalid variant type: ${variant.typeName}`,
          });
        }

        if (variantType.stock < quantity) {
          return res.status(400).json({
            success: false,
            message: `${productVariant.variantName}: ${variantType.name} is out of stock`,
          });
        }
      }

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({
          productId,
          selectedVariants,
          quantity,
        });
      }
    } else {
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: "Product is out of stock",
        });
      }

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({
          productId,
          quantity,
        });
      }
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
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
      select: "name images productVariants price stock vendor discount",
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
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get cart",
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId, selectedVariants } = req.body;
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

      if (selectedVariants?.length > 0) {
        if (
          !item.selectedVariants ||
          item.selectedVariants.length !== selectedVariants.length
        )
          return false;
        return selectedVariants.every((variant) =>
          item.selectedVariants.some(
            (itemVariant) =>
              itemVariant.variantName === variant.variantName &&
              itemVariant.typeName === variant.typeName
          )
        );
      }
      return true;
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
      select: "name images productVariants price stock vendor discount",
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
    console.error("Error removing cart item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
    });
  }
};

const incrementCartItem = async (req, res) => {
  try {
    const { productId, selectedVariants } = req.body;
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

      // If product has variants, check if selected variants match
      if (selectedVariants?.length > 0) {
        if (
          !item.selectedVariants ||
          item.selectedVariants.length !== selectedVariants.length
        )
          return false;
        return selectedVariants.every((variant) =>
          item.selectedVariants.some(
            (itemVariant) =>
              itemVariant.variantName === variant.variantName &&
              itemVariant.typeName === variant.typeName
          )
        );
      }

      return true;// For non-variant products, just match the productId
    });

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let hasStock = false;
    if (selectedVariants?.length > 0) {
      const selectedVariant = selectedVariants[0];
      const variantType = product.productVariants
        .find((v) => v.variantName === selectedVariant.variantName)
        ?.variantTypes.find((t) => t.name === selectedVariant.typeName);

      hasStock =
        variantType && variantType.stock > cart.items[itemIndex].quantity;
    } else {
      hasStock = product.stock > cart.items[itemIndex].quantity;
    }

    if (!hasStock) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
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
      path: "items.productId",
      select: "name images productVariants price stock vendor discount",
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
    const { productId, selectedVariants } = req.body;
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

      // If product has variants, check if selected variants match
      if (selectedVariants?.length > 0) {
        if (
          !item.selectedVariants ||
          item.selectedVariants.length !== selectedVariants.length
        )
          return false;
        return selectedVariants.every((variant) =>
          item.selectedVariants.some(
            (itemVariant) =>
              itemVariant.variantName === variant.variantName &&
              itemVariant.typeName === variant.typeName
          )
        );
      }
      return true;
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
      select: "name images productVariants price stock vendor discount",
      populate: {
        path: "vendor",
        select: "name profileImagePath",
      },
    });

    res.status(200).json({
      success: true,
      message: cart.items[itemIndex]
        ? "Item quantity decreased"
        : "Item removed from cart",
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
