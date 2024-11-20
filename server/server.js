const express = require("express");
const app = express();

const dotenv = require("dotenv")
const connection = require("./config/db");

dotenv.config()
connection()

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`Server is running`);
});
