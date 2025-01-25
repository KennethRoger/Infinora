import axios from "axios";

export const getTopRatedProducts = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/sections/top-rated`,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to get top rated products";
  }
};
