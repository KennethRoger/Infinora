const Coupon = require("../models/Coupon");
const Product = require("../models/Product"); 
const User = require("../models/User"); 
const CouponUsage = require("../models/CouponUsage");
const { verifyToken } = require("../utils/tokenValidator");

const createCoupon = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    const decoded = verifyToken(token);
    const vendorId = decoded.id;
    const {
      name,
      code,
      description,
      discountType,
      discountValue,
      minimumAmount,
      maximumDiscountAmount,
      maxUsesPerUser,
      maxUses,
      newUsersOnly,
    } = req.body;

    const couponData = {
      name,
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minimumAmount: minimumAmount || null,
      maximumDiscountAmount: maximumDiscountAmount || null,
      vendorId,
      userRestriction: {
        newUsersOnly: newUsersOnly || false,
        maxUsesPerUser: maxUsesPerUser || 1,
      },
      maxUses: maxUses || 0,
    };

    const existingCoupon = await Coupon.findOne({ code: couponData.code });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon with this code already exists",
      });
    }

    const coupon = await Coupon.create(couponData);

    res.status(201).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getVendorCoupons = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    const decoded = verifyToken(token);
    const vendorId = decoded.id;
    const coupons = await Coupon.find({ vendorId });

    res.status(200).json({
      success: true,
      data: coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCouponStatus = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }
    const decoded = verifyToken(token);
    const vendorId = decoded.id;
    const { isActive } = req.body;
    console.log("reached, ", isActive, req.params.id);

    const coupon = await Coupon.findOneAndUpdate(
      { _id: req.params.id, vendorId },
      { isActive },
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "No coupon found with that ID",
      });
    }

    res.status(200).json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const applyCoupon = async (req, res) => {
  try {
    const { productId, couponCode, itemQuantity } = req.body;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to apply coupon",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code",
      });
    }

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "This coupon is no longer active",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (coupon.vendorId.toString() !== product.vendor.toString()) {
      return res.status(400).json({
        success: false,
        message: "This coupon cannot be used for this product",
      });
    }

    let basePrice = product.price;
    if (product.discount) {
      basePrice = basePrice * (1 - product.discount / 100);
    }

    const totalPrice = basePrice * itemQuantity;

    if (coupon.minimumAmount && totalPrice < coupon.minimumAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase amount of ₹${coupon.minimumAmount} required to use this coupon`,
      });
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (totalPrice * coupon.discountValue) / 100;
    } else if (coupon.discountType === "fixed") {
      discount = coupon.discountValue;
    }

    if (coupon.maximumDiscountAmount && discount > coupon.maximumDiscountAmount) {
      discount = coupon.maximumDiscountAmount;
    }

    const discountedPrice = totalPrice - discount;

    const userUsage = await CouponUsage.findOne({
      couponId: coupon._id,
      userId: userId,
    });

    if (userUsage) {
      await CouponUsage.findByIdAndUpdate(userUsage._id, {
        $inc: { usageCount: 1 },
      });
    } else {
      await CouponUsage.create({
        couponId: coupon._id,
        userId: userId,
        usageCount: 1,
      });
    }

    await Coupon.findByIdAndUpdate(coupon._id, {
      $inc: { totalUses: 1 },
    });

    res.status(200).json({
      success: true,
      data: {
        originalPrice: product.price,
        totalPrice,
        discountedPrice,
        discount,
      },
    });
  } catch (error) {
    console.error("Error in applyCoupon:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const removeCoupon = async (req, res) => {
  try {
    console.log("Reached controller")
    const { couponCode, productId } = req.body;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const decoded = verifyToken(token);
    const userId = decoded.id;

    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    const userUsage = await CouponUsage.findOne({
      couponId: coupon._id,
      userId: userId,
    });

    if (userUsage) {
      if (userUsage.usageCount > 1) {
        await CouponUsage.findByIdAndUpdate(userUsage._id, {
          $inc: { usageCount: -1 },
        });
      } else {
        await CouponUsage.findByIdAndDelete(userUsage._id);
      }
    }

    await Coupon.findByIdAndUpdate(coupon._id, {
      $inc: { totalUses: -1 },
    });

    res.status(200).json({
      success: true,
      message: "Coupon removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createCoupon,
  getVendorCoupons,
  updateCouponStatus,
  applyCoupon,
  removeCoupon
};
