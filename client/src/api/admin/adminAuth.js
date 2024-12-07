import { data } from "autoprefixer";
import axios from "axios";

export const adminLogin = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/admin/login`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Sign-In Error:", error);
    throw error;
  }
};

export const approveVendor = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/admin/approve-vendor`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Sign-In Error:", error);
    throw error;
  }
};

export const rejectVendor = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/admin/reject-vendor`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Reject Vendor Error:", error);
    throw error.response?.data || error;
  }
};
