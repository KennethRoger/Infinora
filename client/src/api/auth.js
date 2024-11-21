import axios from "axios";

export const generateOTP = async (data) => {
  try {
    await axios
      .post(
        `${import.meta.env.VITE_USERS_API_BASE_URL}/api/users/generate-otp`,
        data
      )
      .then((response) => console.log(response));
  } catch (error) {
    console.error("Error occured sending generateOTP request: ", error);
  }
};

export const verifyOTP = async (data) => {
  await axios.post(`${import.meta.env.VITE_USERS_API_BASE_URL}/api/users/verify`)
}

export const registerUser = async (data) => {
  await axios
    .post("https://jsonplaceholder.typicode.com/posts", data)
    .then((response) => console.log(response));
};
