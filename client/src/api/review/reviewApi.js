import axios from "axios";

export const createReview = async (reviewData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/review`,
      reviewData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create review:", error);
    throw error.response?.data || error;
  }
};

export const getProductReviews = async (productId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/review/product/${productId}?page=${page}&limit=${limit}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch product reviews:", error);
    throw error.response?.data || error;
  }
};

export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/review/${reviewId}`,
      reviewData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update review:", error);
    throw error.response?.data || error;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/review/${reviewId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete review:", error);
    throw error.response?.data || error;
  }
};

export const getProductReviewStats = async (productId) => {
  try {
    const response = await axios.get(`/api/review/stats/${productId}`);
    return response.data.stats;
  } catch (error) {
    throw error.response?.data?.message || "Failed to get review stats";
  }
};
