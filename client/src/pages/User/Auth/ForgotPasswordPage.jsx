import { useState } from "react";
import { useForm } from "react-hook-form";
import LeftBox from "@/components/Form/LeftBox";
import Modal from "@/components/Modal/Modal";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import toast from "react-hot-toast";
import { confirmOtp, generateOTPForPass } from "@/api/user/userData";
import { resendOTP } from "@/api/user/userAuth";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState("");
  const [otpData, setOtpData] = useState();

  const handleEmailSubmit = async (data) => {
    try {
      const response = await generateOTPForPass(data);
      setEmail(data);
      if (response.success) {
        toast.success("OTP sent to your email!");
        setOtpData(response.data);
        setIsModalOpen(true);
      } else {
        toast.error(response.message || "Failed to send OTP. Try again later.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error sending OTP.");
    }
  };

  const handleVerifyOTP = async (e, data) => {
    e.preventDefault();
    try {
      const response = await confirmOtp({ ...data, ...otpData });
      if (response.success) {
        toast.success("OTP verified! Proceed to reset your password.");
        setIsModalOpen(false);
      } else {
        setServerError(response.message || "Invalid OTP.");
      }
    } catch (error) {
      setServerError(error?.response?.data?.message || "Error verifying OTP.");
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await resendOTP({
        email,
        tempUserId: otpData.tempUserId,
      });
      if (response.success) {
        toast.success("OTP resent to your email!");
      } else {
        toast.error(response.message || "Failed to resend OTP.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error resending OTP.");
    }
  };

  return (
    <>
      <LeftBox
        heading={"Forgot Password"}
        description={"Reset your password by confirming the OTP"}
      >
        <form onSubmit={handleSubmit(handleEmailSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Enter your email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 bg-white`}
              {...register("email", {
                required: "Email is required",
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Send OTP
          </button>
        </form>
      </LeftBox>

      <Modal isOpen={isModalOpen}>
        <form onSubmit={handleVerifyOTP}>
          <label className="text-black text-2xl font-semibold mb-5">
            Enter OTP
          </label>
          <p className="text-lg py-2">Enter OTP sent to your email</p>
          <InputOTP
            maxLength={6}
            pattern={/^\d{6}$/}
            onChange={(value) => setOtp(value)}
            className="bg-gray-400"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {serverError && (
            <p className="text-red-600 text-lg mt-4">{serverError}</p>
          )}
          <OtpTimer onResend={handleResendOTP} />
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="bg-[#33A0FF] text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Verify
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
