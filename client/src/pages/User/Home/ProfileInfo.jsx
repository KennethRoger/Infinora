import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function ProfileInfo({ userData, onSubmit }) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || "",
        email: userData.email || "",
        password: "",
      });
    }
  }, [userData, reset]);

  const handleCancel = () => {
    setIsEditing(false);
    reset(userData);
  };

  return (
    <>
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
          isEditing ? "opacity-100" : "opacity-50 pointer-events-none"
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
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${
              isEditing ? "bg-white" : "bg-gray-200"
            }`}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
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
    </>
  );
}
