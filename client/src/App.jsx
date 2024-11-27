import RegisterPage from "./pages/User/Auth/RegisterPage";
import LoginPage from "./pages/User/Auth/LoginPage";
import LoginPageAdmin from "./pages/Admin/Auth/LoginPageAdmin"
import { Routes, Route } from "react-router-dom";
import OTPVerificationPage from "./pages/User/Auth/OTPVerificationPage";
import Header from "./components/Header/Header";
import ProductListPage from "./pages/Admin/Home/ProductListPage";
import ProfilePage from "./pages/User/Home/ProfilePage";
import LandingPage from "./pages/User/Home/LandingPage";
import MainPage from "./pages/User/Home/MainPage";
import CreatorPage from "./pages/User/Creator/CreatorPage";

// const USERS_API = import.meta.env.VITE_USERS_API_BASE_URL;
export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OTPVerificationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/login" element={<LoginPageAdmin />} />
      <Route path="/header" element={<Header />} />
      <Route path="/admin/product-list" element={<ProductListPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/home" element={<MainPage />} />
      <Route path="/home/creator" element={<CreatorPage />} />
    </Routes>
  );
}
