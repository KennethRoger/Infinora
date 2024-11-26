import GenericForm from "../../../components/Form/GenericForm";
import { loginFields } from "../../../constants/user/Form/loginFields";
import { login } from "../../../api/auth";
import LeftBox from "../../../components/Form/LeftBox";
import AuthPage from "../../../components/Auth/AuthPage";
import { Link } from "react-router-dom";
import Button from "@/components/Form/Button";
import { FcGoogle } from "react-icons/fc";
import { googleSignIn } from "../../../api/auth";

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
            apiFunction={login}
            buttonName={"login"}
            buttonStyle={`w-full bg-[#33A0FF] text-white`}
          />
          <div className="flex items-center justify-center my-4">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="px-3 text-sm text-gray-500 font-medium">OR</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
          <Button
            onClick={googleSignIn}
            styles={"text-black flex justify-center items-center gap-2 w-full hover:bg-gray-100"}
          >
            <FcGoogle />
            <p>Sign in with Google</p>
          </Button>
          <div className="text-center mt-14">
            <span>New to Infinora? </span>
            <Link to={"/register"}>
              <span className="text-[#FF9500]">Sign up</span>
            </Link>
          </div>
        </LeftBox>
      </AuthPage>
    </>
  );
}

export default LoginPage;
