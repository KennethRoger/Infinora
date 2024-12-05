import axios from "axios";

// Uncanny edti user API. Because I am dumb

export const fetchUser = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/user/me`,
      { withCredentials: true }
    );
    console.log("Logout successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
};

export const sendOTPToUpdateVerify = async (email) => {
  try {
    axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/user/resend-otp`,
      { email },
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Failed to send OTP:", error);
  }
}