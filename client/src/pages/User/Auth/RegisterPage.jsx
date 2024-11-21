import GenericForm from "../../../components/Form/GenericForm";
import { registerFields } from "../../../constants/Form/registerFields";
import { generateOTP, verifyOTP } from "../../../api/auth";
import Modal from "../../../components/Modal/Modal";
import { useState } from "react";
import AuthPage from "../../../components/Auth/AuthPage";
import LeftBox from "../../../components/Form/LeftBox";
import { otpFields } from "../../../constants/Form/otpFields";

function RegisterPage() {
  // const USERS_API = import.meta.env.VITE_USERS_API_BASE_URL;
  const [modalStatus, setModalStatus] = useState(false);
  return (
    <>
      <AuthPage>
        <LeftBox heading={"Sign Up"} description={"Sign up and explore more"}>
          <GenericForm
            inputFields={registerFields}
            apiFunction={generateOTP}
            buttonName={"register"}
            onClick={() => setModalStatus(true)}
          />
        </LeftBox>
      </AuthPage>
      <Modal isOpen={modalStatus} onClose={() => setModalStatus(false)}>
        <GenericForm
          inputFields={otpFields}
          apiFunction={verifyOTP}
          buttonName={"verify"}
        />
      </Modal>
    </>
  );
}

export default RegisterPage;
