const express = require("express");
const {
  createCoupon,
  getVendorCoupons,
  updateCouponStatus,
  applyCoupon,
  removeCoupon
} = require("../controllers/couponController");

const router = express.Router();

router
  .route("/")
  .post(createCoupon)
  .get(getVendorCoupons);

router
  .route("/:id/status")
  .patch(updateCouponStatus);

router
  .route("/apply")
  .post(applyCoupon);

router
  .route("/remove")
  .post(removeCoupon);

module.exports = router;