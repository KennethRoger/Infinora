import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../../../api/auth";
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

export default function OTPVerificationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const tempUserId = location.state?.tempUserId;

  //

  const [otp, setOtp] = useState("");

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    const requestData = {
      otp,
      tempUserId,
    };

    console.log("Request Data:", requestData);

    const response = await verifyOTP(requestData);
    console.log(response.data);
  };

  // if (!tempUserId) return null;

  return (
    <AuthPage>
      <LeftBox
        heading={"Sign Up"}
        description={"Verify OTP sent to your email"}
      >
        <form onSubmit={handleVerifyOTP}>
          <label className="text-black text-xl mb-5">Enter OTP</label>
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            onChange={(value) => setOtp(value)}
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
          <Button
            buttonType={"submit"}
            styles={`w-[80%] mt-14 bg-[#33A0FF] text-white`}
          >
            Verify
          </Button>
        </form>
      </LeftBox>
    </AuthPage>
  );
}
