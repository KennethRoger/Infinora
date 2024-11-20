import { otpValidate } from "../../../api/auth";
import GenericForm from "../../../components/Form/GenericForm";
import { phoneNumberField } from "../../../constants/Form/phoneNumberField";

const OTPVerification = () => {
  return (
    <>
      <GenericForm inputFields={phoneNumberField} apiFunction={otpValidate}/>
    </>
  )
}

export default OTPVerification;