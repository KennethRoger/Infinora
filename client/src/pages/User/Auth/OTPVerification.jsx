import { otpValidate } from "../../../api/auth";
import AuthPage from "../../../components/Auth/AuthPage";
import GenericForm from "../../../components/Form/GenericForm";
import LeftBox from "../../../components/Form/LeftBox";
import { phoneNumberField } from "../../../constants/Form/phoneNumberField";

const OTPVerification = () => {
  return (
    <>
      <AuthPage>
        <LeftBox
          heading={"Register"}
          description={"Verify your mobile number to continue"}
        >
          <GenericForm
            inputFields={phoneNumberField}
            apiFunction={otpValidate}
          />
        </LeftBox>
      </AuthPage>
    </>
  );
};

export default OTPVerification;
