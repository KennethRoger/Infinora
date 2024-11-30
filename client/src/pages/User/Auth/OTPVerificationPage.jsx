import { useLocation, useNavigate } from "react-router-dom";
import { resendOTP, verifyOTP } from "../../../api/auth";
import AuthPage from "../../../components/Auth/AuthPage";
import LeftBox from "../../../components/Form/LeftBox";
import { useState, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import Button from "@/components/Form/Button";
import OtpTimer from "@/components/OTPTimer/OtpTimer";

export default function OTPVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tempUserId, email } = location.state;

  const [otp, setOtp] = useState("");

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    const requestData = {
      otp,
      tempUserId,
    };
    console.log("Request Data:", requestData);

    const response = await verifyOTP(requestData);
    console.log(response?.data);
  };

  const handleResendOTP = async (e) => {
    const resendReqData = {
      email,
      tempUserId,
    };
    console.log(resendReqData);

    const response = await resendOTP(resendReqData);
    console.log(response?.data);
  };

  // useEffect(() => {
  //   if (!tempUserId) {
  //     navigate("/register");
  //   }
  //   return () => null;
  // }, []);

  return (
    <LeftBox heading={"Sign Up"} description={"Verify OTP sent to your email"}>
      <form onSubmit={handleVerifyOTP}>
        <label className="text-black text-2xl font-semibold mb-5">
          Enter OTP
        </label>
        <p className="text-lg py-2">Enter OTP sent to the number</p>
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          onChange={(value) => setOtp(value)}
          className="bg-gray-400"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <OtpTimer onResend={handleResendOTP} />
        <Button
          buttonType={"submit"}
          styles={`w-[80%] mt-14 bg-[#33A0FF] text-white`}
        >
          Verify
        </Button>
      </form>
    </LeftBox>
  );
}
