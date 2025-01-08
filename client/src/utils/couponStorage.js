const COUPON_STORAGE_KEY = "appliedCoupons";

export const getAppliedCoupons = () => {
  try {
    const coupons = localStorage.getItem(COUPON_STORAGE_KEY);
    return coupons ? JSON.parse(coupons) : [];
  } catch (error) {
    console.error('Error getting coupons:', error);
    return [];
  }
};

export const addAppliedCoupon = (couponData) => {
  try {
    const coupons = getAppliedCoupons();
    
    // Check if a coupon already exists for this product
    const existingCoupon = coupons.find(
      coupon => coupon.productId === couponData.productId
    );

    if (existingCoupon) {
      throw new Error("A coupon is already applied to this item");
    }

    // Check if user already has a coupon from this vendor
    const existingVendorCoupon = coupons.find(
      coupon => coupon.vendorId === couponData.vendorId
    );

    // Only prevent if trying to add another coupon from the same vendor
    if (existingVendorCoupon && existingVendorCoupon.vendorId === couponData.vendorId) {
      throw new Error("You can only use one coupon per vendor");
    }

    coupons.push(couponData);
    localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupons));
    return true;
  } catch (error) {
    console.error('Error adding coupon:', error);
    throw error;
  }
};

export const removeAppliedCoupon = (productId) => {
  try {
    const coupons = getAppliedCoupons();
    const updatedCoupons = coupons.filter(
      coupon => coupon.productId !== productId
    );
    localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(updatedCoupons));
    return true;
  } catch (error) {
    console.error('Error removing coupon:', error);
    return false;
  }
};

export const getCouponForProduct = (productId) => {
  try {
    const coupons = getAppliedCoupons();
    return coupons.find(coupon => coupon.productId === productId) || null;
  } catch (error) {
    console.error('Error getting coupon for product:', error);
    return null;
  }
};

export const hasVendorCoupon = (vendorId) => {
  try {
    const coupons = getAppliedCoupons();
    return coupons.some(coupon => coupon.vendorId === vendorId);
  } catch (error) {
    console.error('Error checking vendor coupon:', error);
    return false;
  }
};
