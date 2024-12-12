import axios from "axios";
import { auth, provider, signInWithPopup } from "../../firebaseConfig";

export const register = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/user/register`,
      data,
      { withCredentials: true }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error occurred sending generateOTP request: ",
      error.response?.data
    );
    name;
    email;
    phoneNumber;
    return error.response?.data;
  }
};

export const resendOTP = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/user/resend-otp`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error on resend: ", error.response?.data);
  }
};

export const verifyOTP = async (data) => {
  try {
    console.log(data);
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/user/verify-otp`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error on verification: ", error.response?.data);
    return error.response?.data;
  }
};

export const login = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/user/login`,
      data,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Sign-In Error:", error);
    throw (
      error.response?.data?.message || "An error occurred. Please try again."
    );
  }
};

export const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log(user);
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/user/google-signin`,
      user,
      { withCredentials: true }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/user/logout`,
      {},
      { withCredentials: true }
    );
    console.log("Logout successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

