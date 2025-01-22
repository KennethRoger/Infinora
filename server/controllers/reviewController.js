const Review = require("../models/Review");
const Order = require("../models/Order");
const { verifyToken } = require("../utils/tokenValidator");

const createReview = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;
    const { productId, orderId, rating, title, review } = req.body;
    console.log(req.body)

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      status: "delivered",
      product: productId,
    });
    console.log(order)

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "You can only review products from delivered orders",
      });
    }

    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const newReview = await Review.create({
      user: userId,
      product: productId,
      rating,
      title,
      review,
      isVerifiedPurchase: true,
      status: "approved",
    });

    await newReview.populate("user", "name email profileImagePath");

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      message: "Error creating review",
      error: error.message,
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalReviews = await Review.countDocuments({
      product: productId,
      status: "approved",
    });

    const reviews = await Review.find({
      product: productId,
      status: "approved",
    })
      .populate("user", "name email profileImagePath")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalReviews / limit);

    res.status(200).json({
      success: true,
      reviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;
    const { reviewId } = req.params;
    const { rating, title, review } = req.body;

    const existingReview = await Review.findOne({
      _id: reviewId,
      user: userId,
    });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found or unauthorized",
      });
    }

    existingReview.rating = rating;
    existingReview.title = title;
    existingReview.review = review;
    existingReview.isEdited = true;

    await existingReview.save();
    await existingReview.populate("user", "name email profileImagePath");

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: existingReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      message: "Error updating review",
      error: error.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;
    const { reviewId } = req.params;

    const review = await Review.findOneAndDelete({
      _id: reviewId,
      user: userId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting review",
      error: error.message,
    });
  }
};

const getProductReviewStats = async (req, res) => {
  try {
    const { productId } = req.params;

    // Get all approved reviews for the product
    const reviews = await Review.find({ 
      product: productId,
      status: "approved" 
    });

    // Calculate average rating
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    res.status(200).json({
      success: true,
      stats: {
        averageRating,
        totalReviews: reviews.length
      }
    });
  } catch (error) {
    console.error("Error getting review stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get review stats",
    });
  }
};

// const productTotalReview = async (req, res) => {
//   try {
//     const productId = req.params;

//     const reviews = await Review.find({ product: productId });

//   } catch (err) {

//   }
// }

module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getProductReviewStats
};
