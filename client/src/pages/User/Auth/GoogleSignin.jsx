import Button from "@/components/Form/Button";
import { FcGoogle } from "react-icons/fc";
import { googleSignIn } from "@/api/auth";
import { useLoading } from "@/hooks/useLoading";

export default function GoogleSignin() {
  const { loading } = useLoading();
  return (
    <>
      <Button
        onClick={googleSignIn}
        styles={
          "text-black flex justify-center items-center gap-2 w-full hover:bg-gray-100"
        }
        attributes={loading ? "disabled" : ""}
      >
        <FcGoogle />
        <p>Sign in with Google</p>
      </Button>
    </>
  );
}
