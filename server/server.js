const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const corsOptions = {
  credentials: true,
};
app.use(cors(corsOptions));

connectDB();

const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

app.listen(port, () => {
  console.log(`Server is running`);
});
