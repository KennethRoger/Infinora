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
