import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_USERS_API_BASE_URL;

export const toggleFavorite = async (productId) => {
  try {

    const response = await axios.post(
      `${API_BASE_URL}/api/favorites/toggle`,
      { productId },
      { withCredentials: true }
    );
    console.log(response)
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getFavorites = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/favorites`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};