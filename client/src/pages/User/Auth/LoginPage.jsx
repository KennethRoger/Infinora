import GenericForm from "../../../components/Form/GenericForm";
import { loginFields } from "../../../constants/Form/loginFields";
import { registerUser } from "../../../api/auth";
import LeftBox from "../../../components/Form/LeftBox";
import AuthPage from "../../../components/Auth/AuthPage";

function LoginPage() {
  return (
    <>
      <AuthPage>
        <LeftBox
          heading={"Login"}
          description={"Login to our endless possibility"}
        >
          <GenericForm
            inputFields={loginFields}
            apiFunction={registerUser}
            buttonName={login}
          />
        </LeftBox>
      </AuthPage>
    </>
  );
}

export default LoginPage;
