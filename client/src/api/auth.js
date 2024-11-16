import axios from "axios"

export const registerUser = async (data) => {
    await axios
      .post("https://jsonplaceholder.typicode.com/posts", data)
      .then((response) => console.log(response));
}