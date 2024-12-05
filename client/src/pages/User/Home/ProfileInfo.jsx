import Modal from "@/components/Modal/Modal";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useOutletContext } from "react-router-dom";

export default function ProfileInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { user } = useOutletContext();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    otp: ""
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onSubmit = async (userData) => {
    setUserData(userData);
    if (userData.email !== user.email) { 
      try {
        const response = await recieveOTPForUpdate(userData);
        setIsModalOpen(true);
        console.log(response);
      } catch (error) {
        console.error("Error generating OTP:", error);
      }
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || "",
        email: userData.email || "",
        phoneNumber: userData.phoneNumber || "",
      });
    }
  }, [userData, reset]);

  const handleCancel = () => {
    setIsEditing(false);
    reset(userData);
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
              {...register("name", { required: "Name is required" })}
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
              })}
              defaultValue={user?.phoneNumber}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Submit
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
          {/* <form onSubmit={handleVerifyOTP}>
            <label className="text-black text-2xl font-semibold mb-5">
              Enter OTP
            </label>
            <p className="text-lg py-2">Enter OTP sent to the number</p>
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
            <Button
              buttonType={"submit"}
              styles={`w-[80%] mt-14 bg-[#33A0FF] text-white`}
            >
              Verify
            </Button>
          </form> */}
        </Modal>
      </div>
    </>
  );
}
