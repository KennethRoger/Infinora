const express = require("express");
const router = express.Router();
const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getProductReviewStats
} = require("../controllers/reviewController");
const { authorizeUser } = require("../middlewares/authenticate");

router.post("/", authorizeUser(["user", "vendor", "admin"]), createReview);
router.get("/product/:productId", getProductReviews);
router.get("/stats/:productId", getProductReviewStats);
router.put("/:reviewId", updateReview);
router.delete("/:reviewId", deleteReview);

module.exports = router;
