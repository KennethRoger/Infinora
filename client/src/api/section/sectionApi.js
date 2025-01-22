import axios from "axios";

export const getTopRatedProducts = async () => {
  try {
    const response = await axios.get("/api/sections/top-rated");
    return response.data.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to get top rated products";
  }
};
