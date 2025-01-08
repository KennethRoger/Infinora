const Favorite = require("../models/Favorite");
const { verifyToken } = require("../utils/tokenValidator");

const toggleFavorite = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;
    const { productId } = req.body;

    const existingFavorite = await Favorite.findOne({ userId, productId });

    if (existingFavorite) {
      await Favorite.findByIdAndDelete(existingFavorite._id);
      return res.status(200).json({
        success: true,
        message: "Removed from favorites",
        isFavorited: false
      });
    } else {
      await Favorite.create({ userId, productId });
      return res.status(200).json({
        success: true,
        message: "Added to favorites",
        isFavorited: true
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFavorites = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const favorites = await Favorite.find({ userId })
      .populate("productId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      favorites,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  toggleFavorite,
  getFavorites,
};