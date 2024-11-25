import { useLocation } from "react-router-dom";
import { verifyOTP } from "../../../api/auth";
import AuthPage from "../../../components/Auth/AuthPage";
import LeftBox from "../../../components/Form/LeftBox";
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
          <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
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
