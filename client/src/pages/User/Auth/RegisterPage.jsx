import GenericForm from "../../../components/Form/GenericForm";
import { registerFields } from "../../../constants/Form/registerFields";
import { generateOTP, googleSignIn } from "../../../api/auth";
import AuthPage from "../../../components/Auth/AuthPage";
import LeftBox from "../../../components/Form/LeftBox";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();

  const otpData = async (data) => {
    try {
      const response = await generateOTP(data);
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
    }
  };

  return (
    <>
      <AuthPage>
        <LeftBox heading={"Sign Up"} description={"Sign up and explore more"}>
          <GenericForm
            inputFields={registerFields}
            apiFunction={otpData}
            buttonName={"register"}
          />
          <p>or</p>
          <button
            onClick={googleSignIn}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >Google</button>
        </LeftBox>
      </AuthPage>
    </>
  );
}

export default RegisterPage;
