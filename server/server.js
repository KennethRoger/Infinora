const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const creatorRoutes = require("./routes/vendorRoutes");
const productRoutes = require("./routes/productRoutes");
const addressRoutes = require("./routes/addressRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/payment");
const couponRoutes = require("./routes/couponRoutes");
const walletRoutes = require("./routes/walletRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const searchRoutes = require("./routes/searchRoutes");
const metricRoutes = require("./routes/metricRoutes");
const tempOrderRoutes = require("./routes/tempOrderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const sectionRoutes = require("./routes/sectionRoutes");

const corsOptions = {
  origin: "https://infinora.vercel.app",
  credentials: true,
};

app.use(cors(corsOptions));

connectDB();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/vendor", creatorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/metrics", metricRoutes);
app.use("/api/temp-order", tempOrderRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/sections", sectionRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
