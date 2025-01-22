import axios from "axios";

export const getCategories = async () => {
  try {
    const response = await axios.get("/api/category/all");
    return response.data.categories;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch categories";
  }
};
