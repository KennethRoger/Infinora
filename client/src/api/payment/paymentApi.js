import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_USERS_API_BASE_URL}/api/payment`;

export const createRazorpayOrder = async (amount) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/create-order`,
      { amount },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/verify`,
      paymentData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
