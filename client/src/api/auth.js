import axios from "axios"

export const otpValidate = () => {
  console.log("Testing OTP")
}

export const registerUser = async (data) => {
    await axios
      .post("https://jsonplaceholder.typicode.com/posts", data)
      .then((response) => console.log(response));
}