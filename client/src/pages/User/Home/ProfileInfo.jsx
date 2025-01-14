import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useOutletContext, useNavigate } from "react-router-dom";
import { recieveOTPForUpdate, updateProfile } from "@/api/user/userData";
import { verifyOTP, resendOTP } from "@/api/user/userAuth";
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Profile Information Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Information</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 font-semibold hover:text-indigo-800 transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`${
              isEditing
                ? "opacity-100 pointer-events-auto"
                : "opacity-100 pointer-events-none"
            } transition-opacity duration-300`}
          >
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isEditing ? "bg-white" : "bg-gray-50"
                  }`}
                  {...register("name")}
                  defaultValue={user?.name}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isEditing ? "bg-white" : "bg-gray-50"
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
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Number Field */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isEditing ? "bg-white" : "bg-gray-50"
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
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-4 mt-8">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
                  >
                    {loading ? <Spinner /> : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Password Settings Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {changePassClicked ? (
            <form
              className="space-y-6"
              onSubmit={handleSubmit(onChangePassSubmit)}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>

              {/* Old Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.oldPassword ? "border-red-500 focus:ring-red-500" : "focus:ring-indigo-500"
                  }`}
                  {...register("oldPassword", {
                    required: "Current password is required",
                  })}
                />
                {errors.oldPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.newPassword ? "border-red-500 focus:ring-red-500" : "focus:ring-indigo-500"
                  }`}
                  {...register("newPassword", {
                    required: "New password is required",
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character",
                    },
                  })}
                  onChange={validateConfirmPassword}
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    passwordMatchError || errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-indigo-500"
                  }`}
                  {...register("confirmPassword", {
                    required: "Please confirm your new password",
                  })}
                  onChange={validateConfirmPassword}
                />
                {passwordMatchError && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordMatchError}
                  </p>
                )}
              </div>

              {/* Password Form Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                  disabled={!!passwordMatchError}
                >
                  Update Password
                </button>
                <button
                  type="button"
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
                  onClick={() => setChangePassClicked(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Settings</h2>
                <p className="text-gray-600">
                  Keep your account secure by regularly updating your password
                </p>
              </div>
              <ButtonPrimary
                onClick={() => setChangePassClicked(true)}
              >
                Change Password
              </ButtonPrimary>
            </div>
          )}
        </div>

        {/* OTP Modal */}
        <Modal isOpen={isModalOpen}>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Verify Your Email</h2>
            <p className="text-gray-600 mb-8">
              Please enter the verification code sent to your email
            </p>
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
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
                  <p className="text-red-600 text-lg">{serverError}</p>
                )}

                <OtpTimer onResend={handleResendOTP} />

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-[#33A0FF] text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Verify
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}
