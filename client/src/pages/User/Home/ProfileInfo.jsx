import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useOutletContext, useNavigate } from "react-router-dom"; // Added useNavigate
import { recieveOTPForUpdate, updateProfile } from "@/api/user/userData";
import { verifyOTP, resendOTP } from "@/api/user/userAuth"; // Added resendOTP import
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import OtpTimer from "@/components/OTPTimer/OtpTimer";
import Modal from "@/components/Modal/Modal";
import { useLoading } from "@/hooks/useLoading";
import Spinner from "@/components/Spinner/Spinner";

export default function ProfileInfo() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempUser, setTempUser] = useState(null);
  const [serverError, setServerError] = useState("");
  const [otp, setOtp] = useState("");

  const { loading, startLoading, stopLoading } = useLoading();

  const { user } = useOutletContext();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    otp: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = async (formData) => {
    setUserData(formData);
    setServerError("");

    if (formData.email !== user.email) {
      try {
        startLoading();
        const response = await recieveOTPForUpdate(formData);
        if (response && response.success) {
          setIsModalOpen(true);
          setTempUser(response.data);
        } else {
          setServerError(response?.message || "Failed to send OTP");
        }
      } catch (error) {
        console.error("Error generating OTP:", error);
        setServerError(
          error?.response?.data?.message ||
            "Failed to generate OTP. Please try again."
        );
      } finally {
        stopLoading();
      }
    } else {
      try {
        startLoading();
        const response = await updateProfile(formData);
        console.log(response);
        if (response && response.success) {
          setIsEditing(false);
        } else {
          setServerError(response?.message || "Failed to update profile");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        setServerError(
          error?.response?.data?.message ||
            "Failed to update profile. Please try again."
        );
      } finally {
        stopLoading();
      }
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await verifyOTP({
        tempUserId: tempUser.tempUserId,
        otp: otp,
      });

      if (response.success) {
        setIsModalOpen(false);

        const updateResponse = await updateProfile(userData);
        if (updateResponse.success) {
          setIsEditing(false);
        }
      } else {
        setServerError(response.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error on OTP verification: ", error);
      setServerError("Failed to verify OTP. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    if (!tempUser) return;

    try {
      const response = await resendOTP({
        tempUserId: tempUser.tempUserId,
        email: tempUser.email,
      });

      if (response.success) {
        setServerError("");
      } else if (response.expired) {
        setIsModalOpen(false);
        navigate("/register");
      } else {
        setServerError(response.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error on resend: ", error);
      setServerError("Failed to resend OTP. Please try again.");
    }
  };

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user, reset]);

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <>
      <div>
        <div className="flex gap-2 items-center mb-4">
          <h1 className="text-2xl font-bold">Profile Information</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-[#33A0FF] text-lg hover:underline"
            >
              Edit
            </button>
          )}
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`${
            isEditing
              ? "opacity-100 pointer-events-auto"
              : "opacity-100 pointer-events-none"
          } transition-opacity duration-300 w-[400px]`}
        >
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
                isEditing ? "bg-white" : "bg-gray-200"
              }`}
              {...register("name")}
              defaultValue={user?.name}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
                isEditing ? "bg-white" : "bg-gray-200"
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
              defaultValue={user?.email}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
                isEditing ? "bg-white" : "bg-gray-200"
              }`}
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Invalid phone number",
                },
              })}
              defaultValue={user?.phoneNumber}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                {loading ? (
                  <Spinner />
                ) : (
                  "Submit"
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </form>

        <Modal isOpen={isModalOpen}>
          <form onSubmit={handleVerifyOTP}>
            <label className="text-black text-2xl font-semibold mb-5">
              Enter OTP
            </label>
            <p className="text-lg py-2">Enter OTP sent to your email</p>
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
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
      </div>
    </>
  );
}
