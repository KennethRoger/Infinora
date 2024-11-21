import GenericForm from "../../../components/Form/GenericForm";
import { registerFields } from "../../../constants/Form/registerFields";
import { generateOTP } from "../../../api/auth";
import AuthPage from "../../../components/Auth/AuthPage";
import LeftBox from "../../../components/Form/LeftBox";

function RegisterPage() {

  return (
    <>
      <AuthPage>
        <LeftBox heading={"Sign Up"} description={"Sign up and explore more"}>
          <GenericForm
            inputFields={registerFields}
            apiFunction={generateOTP}
            buttonName={"register"}
          />
        </LeftBox>
      </AuthPage>
    </>
  );
}

export default RegisterPage;
