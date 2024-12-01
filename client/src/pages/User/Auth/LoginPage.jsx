import GenericForm from "../../../components/Form/GenericForm";
import { loginFields } from "../../../constants/user/Form/loginFields";
import { login } from "../../../api/user/userAuth";
import LeftBox from "../../../components/Form/LeftBox";
import { Link, useNavigate } from "react-router-dom";
import GoogleSignin from "./GoogleSignin";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const { id, email, role } = await login(data);
      console.log(id, email, role);
      if (data) {
        navigate("/home", { state: { id, role } });
      }
    } catch (error) {
      console.error("Error Logging in:", error);
      alert("An error occurred. Please try again.");
    }
  };
  return (
    <>
      <LeftBox
        heading={"Login"}
        description={"Login to our endless possibility"}
      >
        <GenericForm
          inputFields={loginFields}
          apiFunction={handleLogin}
          buttonName={"login"}
          buttonStyle={`w-full bg-[#33A0FF] text-white`}
        />
        <div className="flex items-center justify-center my-4">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="px-3 text-sm text-gray-500 font-medium">OR</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>
        <GoogleSignin />
        <div className="text-center mt-14">
          <span>New to Infinora? </span>
          <Link to={"/register"}>
            <span className="text-[#FF9500]">Sign up</span>
          </Link>
        </div>
      </LeftBox>
    </>
  );
}

export default LoginPage;
