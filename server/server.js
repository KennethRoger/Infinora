const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

const dotenv = require("dotenv");
dotenv.config();
const corsOptions = {
  credentials: true,
};
app.use(cors(corsOptions));
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");

connectDB();

const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server is running`);
});
