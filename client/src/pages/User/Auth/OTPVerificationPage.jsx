import { useLocation, useNavigate } from "react-router-dom";
import { resendOTP, verifyOTP } from "../../../api/user/userAuth";
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
  const { tempUserId, email } = location?.state || {};

  const [otp, setOtp] = useState("");
  const [serverError, setServerError] = useState("");

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    const requestData = {
      otp,
      tempUserId,
    };
    console.log("Request Data:", requestData);

    try {
      const response = await verifyOTP(requestData);
      if (response.success) {
        navigate("/home");
      } else if (response.expired) {
        setServerError("OTP has expired. Please register again.");
        navigate("/register");
      } else {
        setServerError(
          response.message || "Verification failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Error on verification: ", error);
      setServerError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const handleResendOTP = async (e) => {
    const resendReqData = {
      tempUserId,
      email,
    };
    try {
      const response = await resendOTP(resendReqData);
      if (response.success) {
        console.log("OTP resent successfully");
      } else if (response.expired) {
        navigate("/register");
      } else {
        setServerError(
          response.message || "Failed to resend OTP. Please try again."
        );
      }
    } catch (error) {
      console.error("Error on resend: ", error);
      setServerError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  useEffect(() => {
    if (!tempUserId) {
      navigate("/register");
    }
    return;
  }, []);

  return (
    <LeftBox heading={"Sign Up"} description={"Verify OTP sent to your email"}>
      <form onSubmit={handleVerifyOTP}>
        <label className="text-black text-2xl font-semibold mb-5">
          Enter OTP
        </label>
        <p className="text-lg py-2">{`Enter OTP sent to the email ${email}`}</p>
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
        {serverError && (
          <p className="text-red-600 text-lg mt-4">{serverError}</p>
        )}
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
