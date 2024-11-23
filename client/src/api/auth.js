import axios from "axios";
import { auth, provider, signInWithPopup } from "../firebaseConfig";

export const register = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/users/register`,
      data
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error occured sending generateOTP request: ",
      error.response?.data
    );
  }
};

export const verifyOTP = async (data) => {
  try {
    console.log(data);
    await axios
      .post(
        `${import.meta.env.VITE_USERS_API_BASE_URL}/api/users/verify-otp`,
        data
      )
      .then((response) => console.log(response.data.message));
  } catch (error) {
    console.error("Error on verification: ", error.response?.data);
  }
};

export const login = async (data) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_USERS_API_BASE_URL}/api/users/signin`, data);
    console.log(response.data)
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

export const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const response = await axios.post(`${import.meta.env.VITE_USERS_API_BASE_URL}/api/users/google-signin`, user);
    console.log(response)
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};