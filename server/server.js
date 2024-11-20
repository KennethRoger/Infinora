const express = require("express");
const app = express();

const dotenv = require("dotenv");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");

dotenv.config();
connectDB();

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running`);
});
