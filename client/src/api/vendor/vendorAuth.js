import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_USERS_API_BASE_URL;

export const registerVendorDetails = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/vendor/register`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        success: false,
        message: "Error registering vendor details",
      }
    );
  }
};

