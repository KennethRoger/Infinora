import axios from "axios";

export const verifyUser = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/auth/verify`,
      { withCredentials: true }
    );
    console.log(data);
    return data;
  } catch (error) {
    return {
      authenticated: false,
      message: error.response?.data?.message || "Verification failed.",
    };
  }
};

export const changePassword = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/auth/change-password`,
      data,
      { withCredentials: true }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("password change failed! Error:", error);
    throw error;
  }
};