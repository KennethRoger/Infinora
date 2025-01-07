import axios from "axios";

export const createCoupon = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/coupon`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error while creating coupon: ", error);
    throw error;
  }
};

export const getVendorCoupons = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/coupon`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error while fetching coupons: ", error);
    throw error;
  }
};

export const updateCouponStatus = async (couponId, data) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/coupon/${couponId}/status`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error while updating coupon status: ", error);
    throw error;
  }
};
