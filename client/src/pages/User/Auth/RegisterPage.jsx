import GenericForm from "../../../components/Form/GenericForm";
import { registerFields } from "../../../constants/Form/registerFields";
import { registerUser } from "../../../api/auth";

function RegisterPage() {
  // const USERS_API = import.meta.env.VITE_USERS_API_BASE_URL;
  return (
    <>
      <GenericForm inputFields={registerFields} apiFunction={registerUser} />
    </>
  );
}

export default RegisterPage;
