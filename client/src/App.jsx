import RegisterPage from "./pages/User/Auth/RegisterPage";
import LoginPage from "./pages/User/Auth/LoginPage";
import LoginPageAdmin from "./pages/Admin/LoginPageAdmin";
import { Routes, Route } from "react-router-dom";
import OTPVerificationPage from "./pages/User/Auth/OTPVerificationPage";
import Header from "./components/Header/Header";

// const USERS_API = import.meta.env.VITE_USERS_API_BASE_URL;
export function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<OTPVerificationPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<h1>Routes: /register, /login</h1>} />
      <Route path="/admin/login" element={<LoginPageAdmin />} />
      <Route path="/header" element={<Header />} />
    </Routes>
  );
}
