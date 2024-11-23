import { login } from "../../api/auth";
import AuthPage from "../../components/Auth/AuthPage";
import GenericForm from "../../components/Form/GenericForm";
import { loginFields } from "../../constants/admin/form/loginFieldAdmin";

export default function LoginPageAdmin() {
  return (
    <>
      <AuthPage>
        <div className="bg-white p-8 rounded-lg shadow-md w-96 min-h-200">
          <h1 className="text-2xl font-semibold text-center mb-6">
            Infinora Admin Login
          </h1>
          <GenericForm
            inputFields={loginFields}
            apiFunction={login}
            buttonName={"verify"}
            buttonStyle={"w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"}
          />
        </div>
      </AuthPage>
    </>
  );
}
