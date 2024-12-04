import { FcGoogle } from "react-icons/fc";
import { googleSignIn } from "@/api/user/userAuth";
import { useLoading } from "@/hooks/useLoading";
import { useNavigate } from "react-router-dom";

export default function GoogleSignin() {
  const { loading, startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();
  const handleGoogleSignIn = async () => {
    try {
      startLoading();
      const response = await googleSignIn();
      if (response.success) {
        navigate("/home");
      }
    } catch (error) {
      stopLoading();
      console.error("Google Sign-In Error:", error);
    } finally {
      stopLoading();
    }
  };
  return (
    <>
      <button
        onClick={handleGoogleSignIn}
        className="text-black flex justify-center items-center gap-2 w-full hover:bg-gray-100  border px-5 min-w-[130px] rounded h-12 shadow-md text-lg"
        attributes={loading ? "disabled" : ""}
      >
        <FcGoogle />
        <p>{loading ? "Signing in..." : "Sign in with Google"}</p>
      </button>
    </>
  );
}
