import axios from "axios";

export const getVendorProducts = async (vendorId) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/vendor/products/${vendorId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch vendor products:", error);
    throw error;
  }
};
