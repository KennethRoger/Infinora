const express = require("express");
const router = express.Router();
const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getProductReviewStats
} = require("../controllers/reviewController");

router.post("/", createReview);
router.get("/product/:productId", getProductReviews);
router.get("/stats/:productId", getProductReviewStats);
router.put("/:reviewId", updateReview);
router.delete("/:reviewId", deleteReview);

module.exports = router;
