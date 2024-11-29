import { FcGoogle } from "react-icons/fc";
import { googleSignIn } from "@/api/auth";
import { useLoading } from "@/hooks/useLoading";

export default function GoogleSignin() {
  const { loading } = useLoading();
  return (
    <>
      <button
        onClick={googleSignIn}
        className="text-black flex justify-center items-center gap-2 w-full hover:bg-gray-100  border px-5 min-w-[130px] rounded h-12 shadow-md text-lg"
        attributes={loading ? "disabled" : ""}
      >
        <FcGoogle />
        <p>Sign in with Google</p>
      </button>
    </>
  );
}
