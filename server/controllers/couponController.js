const Coupon = require("../models/Coupon");
const { verifyToken } = require("../utils/tokenValidator")

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

    // Create coupon object with validated data
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

    // Check if coupon with same code exists
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

module.exports = {
  createCoupon,
  getVendorCoupons,
  updateCouponStatus,
};