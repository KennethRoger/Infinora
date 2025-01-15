import axios from "axios";

export const createTempOrder = async (orderData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/temp-order`,
      orderData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getTempOrderById = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/temp-order/${id}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getUserTempOrders = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/temp-order`,
      { withCredentials: true }
    );
    console.log(response)
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateTempOrderStatus = async (id, statusData) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/temp-order/${id}/status`,
      statusData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};