import GenericForm from "../../../components/Form/GenericForm";
import { registerFields } from "../../../constants/user/Form/registerFields";
import { register, googleSignIn } from "../../../api/auth";
import AuthPage from "../../../components/Auth/AuthPage";
import LeftBox from "../../../components/Form/LeftBox";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Button from "@/components/Form/Button";
import Spinner from "@/components/Spinner/Spinner";
import { useState } from "react";

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const otpData = async (data) => {
    try {
      setLoading(true);
      const response = await register(data);
      // console.log(response);
      if (response.success) {
        const tempUserId = response.tempUserId;
        navigate("/verify-otp", { state: { tempUserId } });
      } else {
        alert("Error generating OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error generating OTP:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthPage>
        <LeftBox heading={"Sign Up"} description={"Sign up and explore more"}>
          <div>
            <Spinner />
            <GenericForm
              inputFields={registerFields}
              apiFunction={otpData}
              buttonName={loading ? <Spinner /> : "Register"}
              buttonStyle={`w-full text-white ${
                loading ? "bg-[#006dcc] cursor-not-allowed" : "bg-[#33A0FF]"
              }`}
              buttonAttributes={loading ? "disabled" : ""}
            />
            <div className="flex items-center justify-center my-4">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span className="px-3 text-sm text-gray-500 font-medium">OR</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            <Button
              onClick={googleSignIn}
              styles={
                "text-black flex justify-center items-center gap-2 w-full hover:bg-gray-100"
              }
              attributes={loading ? "disabled" : ""}
            >
              <FcGoogle />
              <p>Sign in with Google</p>
            </Button>
          </div>
          <div className="text-center mt-10">
            <span>Already a user? </span>
            <Link to={loading ? "/login" : "#"}>
              <span className="text-[#FF9500]">Sign in</span>
            </Link>
          </div>
        </LeftBox>
      </AuthPage>
    </>
  );
}

export default RegisterPage;
