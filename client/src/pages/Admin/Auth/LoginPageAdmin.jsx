import { adminLogin } from "@/api/admin/adminAuth";
import AuthPage from "../../../components/Auth/AuthPage";
import GenericForm from "../../../components/Form/GenericForm";
import { loginFields } from "../../../constants/admin/form/loginFieldAdmin";
import { useNavigate } from "react-router-dom";

export default function LoginPageAdmin() {
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const response = await adminLogin(data);
      console.log("Admin login response:", response);
      
      if (response && response.data) {
        navigate("/admin/dashboard");
      } else {
        console.error("Login failed:", response);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <AuthPage>
        <div className="bg-white p-8 rounded-lg shadow-xl w-96 min-h-200">
          <h1 className="text-2xl font-semibold text-center mb-6">
            Infinora Admin Login
          </h1>
          <GenericForm
            inputFields={loginFields}
            apiFunction={handleLogin}
            buttonName={"verify"}
            buttonStyle={
              "w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
            }
          />
        </div>
      </AuthPage>
    </>
  );
}
