import RegisterPage from "./pages/User/Auth/RegisterPage";
import LoginPage from "./pages/User/Auth/LoginPage";
import LoginPageAdmin from "./pages/Admin/Auth/LoginPageAdmin";
import { Routes, Route, Navigate } from "react-router-dom";
import OTPVerificationPage from "./pages/User/Auth/OTPVerificationPage";
import Header from "./components/Header/Header";
import ProductListPage from "./pages/Admin/Home/ProductListPage";
import ProfilePage from "./pages/User/Home/ProfilePage";
import LandingPage from "./pages/User/Home/LandingPage";
import MainPage from "./pages/User/Home/MainPage";
import CreatorPage from "./pages/User/Creator/CreatorPage";
import UserListPage from "./pages/Admin/Home/UserListPage";
import CreatorListPage from "./pages/Admin/Home/CreatorListPage";
import AdminLayout from "./Layouts/Admin/AdminLayout";
import DashboardPage from "./pages/Admin/Home/DashboardPage";
import AuthLayout from "./Layouts/User/AuthLayout";
import HomeLayout from "./Layouts/User/HomeLayout";

// const USERS_API = import.meta.env.VITE_USERS_API_BASE_URL;
export function App() {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/" element={<LandingPage />} />
      
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="verify-otp" element={<OTPVerificationPage />} />
      </Route>
      
      <Route path="/home" element={<HomeLayout />}>
        <Route index element={<MainPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="creator" element={<CreatorPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<LoginPageAdmin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="product-list" element={<ProductListPage />} />
        <Route path="user-list" element={<UserListPage />} />
        <Route path="creator-list" element={<CreatorListPage />} />
      </Route>
    </Routes>
  );
}
