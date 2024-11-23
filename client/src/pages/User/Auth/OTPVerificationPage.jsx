import { useLocation } from "react-router-dom";
import { verifyOTP } from "../../../api/auth";
import AuthPage from "../../../components/Auth/AuthPage";
import GenericForm from "../../../components/Form/GenericForm";
import LeftBox from "../../../components/Form/LeftBox";
import { otpFields } from "../../../constants/user/Form/otpFields";
import { useState } from "react";

export default function OTPVerificationPage() {
  const [countDown, setCountDown] = useState(0);
  const location = useLocation();
  const { tempUserId } = location.state;
  console.log(tempUserId);

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
          {countDown === 0 ? (
            <p>Resend OTP in {countDown}</p>
          ) : (
            <p>Resend OTP</p>
          )}
        </LeftBox>
      </AuthPage>
    </>
  );
}
