import GenericForm from "../../../components/Form/GenericForm";
import { loginFields } from "../../../constants/user/Form/loginFields";
import { login } from "../../../api/user/userAuth";
import LeftBox from "../../../components/Form/LeftBox";
import { Link, useNavigate } from "react-router-dom";
import GoogleSignin from "./GoogleSignin";
import { useState } from "react";
import { useLoading } from "@/hooks/useLoading";
import Spinner from "@/components/Spinner/Spinner";

function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { loading, startLoading, stopLoading } = useLoading();

  const handleLogin = async (data) => {
    try {
      startLoading();
      const { user, message } = await login(data);

      if (user) {
        const { id, email, role } = user;
        navigate("/home", { state: { id, role } });
      } else {
        setServerError("Unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error Logging in:", error);
      setServerError(error || "An error occurred. Please try again.");
    } finally {
      stopLoading();
    }
  };

  return (
    <>
      <LeftBox
        heading={"Login"}
        description={"Login to our endless possibility"}
      >
        <GenericForm
          inputFields={loginFields}
          apiFunction={handleLogin}
          buttonName={loading ? <Spinner /> : "login"}
          buttonStyle={`w-full bg-[#33A0FF] text-white`}
          serverError={serverError}
        />
        <div className="mt-3">
          <Link to={"/forgot-password"} className="text-lg text-blue-500">Forgot Password?</Link>
        </div>
        <div className="flex items-center justify-center my-4">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="px-3 text-sm text-gray-500 font-medium">OR</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>
        <GoogleSignin />
        <div className="text-center mt-10">
          <span>Don't have an account? </span>
          <Link to={loading ? "#" : "/register"}>
            <span className="text-[#FF9500]">Register</span>
          </Link>
        </div>
      </LeftBox>
    </>
  );
}

export default LoginPage;
