import InputBox from "@/components/Form/InputBox";
import Modal from "@/components/Modal/Modal";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

export default function CreatorSection() {
  const navigate = useNavigate();
  const { user, loading, refreshUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [formValues, setFormValues] = useState({ password: "", terms: false });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (formValues.password && formValues.password.length < 1) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        password: "Password is required",
      }));
    } else {
      setFormErrors((formErrors) => ({
        ...formErrors,
        password: "",
      }));
    }
    if (!formValues.terms) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        terms: "You must accept the terms and conditions",
      }));
    } else {
      setFormErrors((formErrors) => ({
        ...formErrors,
        terms: false,
      }));
    }
  }, [formValues]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        await refreshUser();
      } catch (error) {
        console.error("Error refreshing user:", error);
      }
    };
    loadUser();
  }, [refreshUser]);

  const onSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!formValues.password) {
        setFormErrors((prev) => ({
          ...prev,
          password: "Password is required",
        }));
        return;
      }
      if (!formValues.terms) {
        setFormErrors((prev) => ({
          ...prev,
          terms: "You must accept the terms and conditions",
        }));
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_USERS_API_BASE_URL}/api/vendor/verify`,
        formValues,
        { withCredentials: true }
      );

      await refreshUser();
      navigate("/home/profile/creator-profile");
    } catch (error) {
      console.error(
        "Error during verification:",
        error.response?.data || error.message
      );
      if (error.response?.data?.message) {
        if (error.response.data.message.includes("terms")) {
          setFormErrors((prev) => ({
            ...prev,
            terms: error.response.data.message,
          }));
        } else {
          setFormErrors((prev) => ({
            ...prev,
            password: error.response.data.message,
          }));
        }
      }
    }
  };

  const handleStartAsCreator = async () => {
    if (loading) return;
    await refreshUser();

    if (!user) {
      navigate("/login");
      return;
    }
    setIsOpen(true);
  };

  return (
    <>
      <main className="pt-[75px] flex">
      {!user?.isVerified && (
        
        <div className="relative w-[50%] bg-gradient-to-b from-[#FF6B6B] to-[#FFC75F] pb-24 pt-5">
          <img
            src="/creator-representation.png"
            alt="creator representation"
            className="absolute inset-0 w-full opacity-10 pointer-events-none z-0"
          />
          <div className="relative flex flex-col items-center text-center z-10">
            <img
              src="/creating-idea.png"
              alt="a person with many ideas"
              className="w-[400px]"
            />
            <div className="w-[450px] flex flex-col gap-5">
              <h1 className="font-extrabold text-4xl">
                Start your journey as a creator
              </h1>
              <p className="text-2xl text-gray-800">
                Bring your ideas to life with Infinora! Start creating unique,
                inspiring products and let your creativity shine. Showcase your
                vision to the world and make an impact with creations that truly
                stand out.
              </p>
              <div>
                <button
                  onClick={handleStartAsCreator}
                  className="relative bg-gradient-to-r from-[#FFA500] to-[#E7511A] rounded-xl font-bold px-5 min-w-[130px] h-12 shadow-[0px_3px_4px] shadow-[#000000]/50 text-lg z-20"
                >
                  Start as a creator
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        <div className={`relative ${user?.isVerified ? 'w-full' : 'w-[50%]'} bg-gradient-to-b from-[#4169E1] to-[#4682B4] pb-24 pt-5`}>
          <img
            src="/craft-representation.png"
            alt="craft representation"
            className={`absolute inset-0 ${user?.isVerified ? 'mx-auto' : ' w-full'} opacity-10 pointer-events-none z-0`}
          />
          <div className="relative flex flex-col items-center text-center z-10">
            <img
              src="/young-man-idea.png"
              alt="a person with many ideas"
              className="w-[270px]"
            />
            <div className="w-[450px] flex flex-col gap-5">
              <h1 className="font-extrabold text-4xl">Make My Creativity</h1>
              <p className="text-2xl text-gray-800 mb-[95px]">
                Turn your vision into reality with our creators' help. Share
                your ideas and let Infinora's skilled artists bring them to life
                just as you imagined.
              </p>
              <div>
                <button className="relative bg-gradient-to-r from-[#396AFC] to-[#2948FF] rounded-xl font-bold px-5 min-w-[130px] h-12 text-lg shadow-[0px_3px_4px] shadow-[#000000]/50 z-20">
                  Craft my vision
                </button>
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={isOpen}>
          <div className="flex items-center justify-center ">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center space-y-6">
                <div className="relative flex justify-center">
                  <img src="/welcome-creator.png" className="w-[300px]" />
                </div>

                <h2 className="text-2xl font-bold text-black mx-auto">
                  Start your journey as one of our creators with simple process
                </h2>
              </div>

              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <InputBox
                    label="Enter Your Password"
                    name="password"
                    type="password"
                    onChange={(e) =>
                      setFormValues((formValues) => ({
                        ...formValues,
                        [e.target.name]: e.target.value,
                      }))
                    }
                    value={formValues?.password}
                    styles="w-full border-b-2 border-black focus:outline-none focus:border-blue-500"
                  />
                  {formErrors?.password && (
                    <p className="text-red-500 text-sm">
                      {formErrors?.password}
                    </p>
                  )}
                  <div className="text-right">
                    <a
                      href="#"
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      forgot password?
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="terms"
                    type="checkbox"
                    name="terms"
                    checked={formValues?.terms}
                    onChange={(e) =>
                      setFormValues((formValues) => ({
                        ...formValues,
                        [e.target.name]: e.target.checked,
                      }))
                    }
                    className="w-4 h-4"
                  />

                  <label htmlFor="terms" className="text-sm leading-none">
                    By checking this you are agreeing to our{" "}
                    <a
                      href="#"
                      className="text-orange-500 hover:text-orange-600"
                    >
                      terms and conditions
                    </a>
                  </label>
                </div>
                {formErrors?.terms && (
                  <p className="text-red-500 text-sm">{formErrors?.terms}</p>
                )}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white"
                  >
                    Proceed
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-gray-200 hover:bg-gray-300 px-4 py-2 text-black"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      </main>
    </>
  );
}
