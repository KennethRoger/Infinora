import AuthPage from "@/components/Auth/AuthPage";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <AuthPage>
      <Outlet />
    </AuthPage>
  )
}
