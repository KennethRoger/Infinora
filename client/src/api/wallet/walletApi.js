import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_USERS_API_BASE_URL}/api/wallet`;

export const addMoneyToWallet = async (amount) => {
  try {
    
    const razorpayResponse = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/payment/create-order`,
      { amount },
      { withCredentials: true }
    );

    if (!razorpayResponse.data.success) {
      throw new Error("Failed to create Razorpay order");
    }

    return razorpayResponse.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const verifyWalletPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/verify-payment`,
      paymentData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const processWalletPayment = async (amount) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/process-payment`,
      { amount },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
