import axios from "axios";
import { auth, provider, signInWithPopup } from "../firebaseConfig";

export const generateOTP = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/users/generate-otp`,
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

export const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("User Info:", user);
    await axios.post(`${import.meta.env.VITE_USERS_API_BASE_URL}/api/users/google-signin`);
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

export const registerUser = async (data) => {
  await axios
    .post("https://jsonplaceholder.typicode.com/posts", data)
    .then((response) => console.log(response));
};
