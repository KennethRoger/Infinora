import RegisterPage from "./pages/User/Auth/RegisterPage";
import LoginPage from "./pages/User/Auth/LoginPage";
import { Routes, Route } from "react-router-dom";
import OTPVerification from "./pages/User/Auth/OTPVerification";

// const USERS_API = import.meta.env.VITE_USERS_API_BASE_URL;
export function App() {
  return (
    <Routes>
      <Route path="/register/verify" element={<OTPVerification />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<h1>Routes: /register, /login</h1>} />
    </Routes>
  );
}
