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
