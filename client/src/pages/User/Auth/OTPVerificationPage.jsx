import { useLocation } from "react-router-dom";
import { verifyOTP } from "../../../api/auth";
import AuthPage from "../../../components/Auth/AuthPage";
import GenericForm from "../../../components/Form/GenericForm";
import LeftBox from "../../../components/Form/LeftBox";
import { otpFields } from "../../../constants/Form/otpFields";

export default function OTPVerificationPage() {
  const location = useLocation();
  const { tempUserId } = location.state;
  console.log(tempUserId)

  const handleVerifyOTP = async (formData) => {
    const requestData = {
      ...formData,
      tempUserId,
    };
    return await verifyOTP(requestData);
  };

  return (
    <>
      <AuthPage>
        <LeftBox
          heading={"Sign Up"}
          description={"Verify OTP send to your email"}
        >
          <GenericForm
            inputFields={otpFields}
            apiFunction={handleVerifyOTP}
            buttonName={"verify"}
          />
        </LeftBox>
      </AuthPage>
    </>
  );
}
