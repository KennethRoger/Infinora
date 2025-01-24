const express = require("express");
const {
  createCoupon,
  getVendorCoupons,
  updateCouponStatus,
  applyCoupon,
  removeCoupon,
} = require("../controllers/couponController");
const { authorizeUser } = require("../middlewares/authenticate");

const router = express.Router();

router
  .route("/")
  .post(authorizeUser(["user", "vendor", "admin"]), createCoupon)
  .get(authorizeUser(["user", "vendor", "admin"]), getVendorCoupons);

router
  .route("/:id/status")
  .patch(authorizeUser(["user", "vendor", "admin"]), updateCouponStatus);

router
  .route("/apply")
  .post(authorizeUser(["user", "vendor", "admin"]), applyCoupon);

router
  .route("/remove")
  .post(authorizeUser(["user", "vendor", "admin"]), removeCoupon);

module.exports = router;
