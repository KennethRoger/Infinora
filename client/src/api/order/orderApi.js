import axios from "axios";

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/order`,
      orderData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
};

export const getUserOrders = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/order`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user orders:", error);
    throw error.response?.data || error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/order/admin/${orderId}/cancel`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to cancel order:", error);
    throw error.response?.data || error;
  }
};

export const adminCancelOrder = async (orderId) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/order/admin/${orderId}/cancel`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to cancel order:", error);
    throw error.response?.data || error;
  }
};

export const confirmDelivered = async (orderId) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/order/admin/${orderId}/confirm-delivered`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

