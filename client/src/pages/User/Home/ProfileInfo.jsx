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
import toast from "react-hot-toast";
import ButtonPrimary from "@/components/Buttons/ButtonPrimary";
import { changePassword } from "@/api/auth/verifyUser";

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

  const [changePassClicked, setChangePassClicked] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState("");
  useEffect(() => {});

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const validateConfirmPassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError("");
    }
  };

  const onChangePassSubmit = async (data) => {
    try {
      const response = await changePassword(data);
      if (response.success) {
        toast.success("Password changed successfully");
        setChangePassClicked(false);
        reset()
      } else {
        toast.error(
          response.message || "Failed to change the password. Try again later!"
        );
      }
    } catch (error) {
      console.error("Error during password change:", error);
      const serverMessage =
        error?.response?.data?.message ||
        error.message ||
        "An unexpected error occurred. Please try again later.";

      toast.error(serverMessage);
    }
  };

  const onSubmit = async (formData) => {
    setUserData(formData);
    setServerError("");
    useEffect(() => {
      console.log(changePassClicked);
    }, [changePassClicked]);
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
          toast.success("User updated successfully");
        } else {
          setServerError(response?.message || "Failed to update profile");
          toast.error("Failed to update user");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Error updating user profile");
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
        userId: user._id,
        name: userData.name || user.name,
        tempUserId: tempUser.tempUserId,
        otp: otp,
        isUpdate: true,
      });
      if (response.success) {
        toast.success("User updated successfully");
        setIsModalOpen(false);
        setIsEditing(false);
      } else {
        setServerError(response.message || "Invalid OTP");
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error on OTP verification: ", error);
      setServerError("Failed to verify OTP. Please try again.");
      toast.error("Failed to verify OTP. Please try again.");
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
        toast.success("OTP resend successfully");
      } else if (response.expired) {
        setIsModalOpen(false);
        navigate("/register");
      } else {
        setServerError(response.message || "Failed to resend OTP");
        toast.error("Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error on resend: ", error);
      setServerError("Failed to resend OTP. Please try again.");
    }
  };

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
        <div className="flex gap-10">
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
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium"
              >
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
                  {loading ? <Spinner /> : "Submit"}
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
          <div className="">
            {changePassClicked ? (
              <form
                className="p-6 w-full max-w-sm float-right"
                onSubmit={handleSubmit(onChangePassSubmit)}
              >
                <h2 className="text-2xl font-bold mb-5">Change Password</h2>

                {/* Old Password */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Old Password
                  </label>
                  <input
                    type="password"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${
                      errors.oldPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("oldPassword", {
                      required: "Old password is required",
                    })}
                  />
                  {errors.oldPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.oldPassword.message}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${
                      errors.newPassword ? "border-red-500" : "border-gray-300"
                    }`}
                    {...register("newPassword", {
                      required: "New password is required",
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message:
                          "Password must be atleast 8 characters long and only include an uppercase, lowercase, number, and special character",
                      },
                    })}
                    onChange={validateConfirmPassword}
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring ${
                      passwordMatchError || errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    {...register("confirmPassword", {
                      required: "Confirm password is required",
                    })}
                    onChange={validateConfirmPassword}
                  />
                  {passwordMatchError && (
                    <p className="text-red-500 text-sm mt-1">
                      {passwordMatchError}
                    </p>
                  )}
                </div>
                <div className="flex gap-5">
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    disabled={!!passwordMatchError}
                  >
                    Update Password
                  </button>
                  <button
                    className="w-full bg-gray-500 text-white py-2 px-4 rounde transition"
                    onClick={() => setChangePassClicked(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <ButtonPrimary onClick={() => setChangePassClicked(true)}>
                Change Password
              </ButtonPrimary>
            )}
          </div>
        </div>
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
