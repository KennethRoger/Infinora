import { verifyOTP } from "../../../api/auth";
import AuthPage from "../../../components/Auth/AuthPage";
import GenericForm from "../../../components/Form/GenericForm";
import LeftBox from "../../../components/Form/LeftBox";
import { otpFields } from "../../../constants/Form/otpFields";

export default function OTPVerificationPage() {
  return (
    <>
      <AuthPage>
        <LeftBox
          heading={"Sign Up"}
          description={"Verify OTP send to your email"}
        >
          <GenericForm
            inputFields={otpFields}
            apiFunction={verifyOTP}
            buttonName={"verify"}
          />
        </LeftBox>
      </AuthPage>
    </>
  );
}
