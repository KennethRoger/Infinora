const Product = require("../models/Product");
const Review = require("../models/Review");

const getTopRatedProducts = async (req, res) => {
  try {
    const productsWithRatings = await Review.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" }
        }
      },
      { $sort: { averageRating: -1 } },
      { $limit: 5 }
    ]);

    const productIds = productsWithRatings.map(p => p._id);
    
    const topReviews = await Review.find({
      product: { $in: productIds },
      status: "approved"
    })
    .sort({ rating: -1 })
    .populate('product', 'images')
    .populate('user', 'name')
    .select('review rating product user')
    .lean();

    // Get one highest rated review per product
    const uniqueProductReviews = productIds.map(productId => {
      return topReviews.find(review => review.product._id.toString() === productId.toString());
    }).filter(Boolean);

    const carouselData = uniqueProductReviews.map(review => ({
      image: review.product.images[0],
      review: review.review,
      userName: review.user.name,
      rating: review.rating
    }));

    res.status(200).json({
      success: true,
      data: carouselData
    });
  } catch (error) {
    console.error("Error getting top rated products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get top rated products"
    });
  }
};

module.exports = {
  getTopRatedProducts
};