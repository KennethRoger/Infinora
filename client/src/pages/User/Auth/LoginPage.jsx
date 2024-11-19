import GenericForm from "../../../components/Form/GenericForm";
import { loginFields } from "../../../constants/Form/loginFields";
import { registerUser } from "../../../api/auth";

function LoginPage() {
  return (
    <>
      <GenericForm inputFields={loginFields} apiFunction={registerUser} />
    </>
  );
}

export default LoginPage;
