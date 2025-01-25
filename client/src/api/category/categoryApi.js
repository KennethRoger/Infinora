import axios from "axios";

export const getCategories = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/category/all`,
      { withCredentials: true }
    );
    return response.data.categories;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch categories";
  }
};
