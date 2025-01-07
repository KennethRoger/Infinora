const express = require("express");
const {
  createCoupon,
  getVendorCoupons,
  updateCouponStatus,
} = require("../controllers/couponController");

const router = express.Router();

router
  .route("/")
  .post(createCoupon)
  .get(getVendorCoupons);

router
  .route("/:id/status")
  .patch(updateCouponStatus);

module.exports = router;