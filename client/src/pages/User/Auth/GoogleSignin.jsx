import { FcGoogle } from "react-icons/fc";
import { googleSignIn } from "@/api/user/userAuth";
import { useLoading } from "@/hooks/useLoading";
import { useNavigate } from "react-router-dom";

export default function GoogleSignin() {
  const { loading } = useLoading();
  const navigate = useNavigate();
  const handleGoogleSignIn = async () => {
    try {
      const response = await googleSignIn();
      if (response.success) {
        navigate("/home");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
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
        <p>Sign in with Google</p>
      </button>
    </>
  );
}
