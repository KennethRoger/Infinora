import GenericForm from "../../../components/Form/GenericForm";
import { registerFields } from "../../../constants/user/Form/registerFields";
import { register } from "../../../api/user/userAuth";
import LeftBox from "../../../components/Form/LeftBox";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner/Spinner";
import GoogleSignin from "./GoogleSignin";
import { useLoading } from "@/hooks/useLoading";
import { useState } from "react";

function RegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const { loading, startLoading, stopLoading } = useLoading();

  const otpData = async (data) => {
    try {
      startLoading();
      const response = await register(data);
      if (response && response.success) {
        const { tempUserId, email } = response.data;
        navigate("/verify-otp", { state: { tempUserId, email } });
      } else {
        setServerError(response?.message || "An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error generating OTP:", error);
      setServerError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      stopLoading();
    }
  };

  return (
    <>
      <LeftBox heading={"Register"} description={"Sign up and explore more"}>
        <div>
          <GenericForm
            inputFields={registerFields}
            apiFunction={otpData}
            buttonName={loading ? <Spinner /> : "Register"}
            buttonStyle={`w-full text-white ${
              loading ? "bg-[#006dcc] cursor-not-allowed" : "bg-[#33A0FF]"
            }`}
            buttonAttributes={loading ? "disabled" : ""}
            serverError={serverError}
          />
        </div>
        <div className="flex items-center justify-center my-4">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="px-3 text-sm text-gray-500 font-medium">OR</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>
        <GoogleSignin />
        <div className="text-center mt-10">
          <span>Already a user? </span>
          <Link to={loading ? "#" : "/login"}>
            <span className="text-[#FF9500]">Sign in</span>
          </Link>
        </div>
      </LeftBox>
    </>
  );
}

export default RegisterPage;
