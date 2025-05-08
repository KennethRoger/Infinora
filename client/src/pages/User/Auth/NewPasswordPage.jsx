import { changeToNewPassword } from "@/api/user/userData";
import LeftBox from "@/components/Form/LeftBox";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export default function NewPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [serverError, setServerError] = useState();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const validateConfirmPassword = () => {
    if (confirmPassword && newPassword !== confirmPassword) {
      setPasswordMatchError("Passwords do not match.");
    } else {
      setPasswordMatchError("");
    }
  };

  const onSubmit = async (data) => {
    if (passwordMatchError) {
      return;
    }
    try {
      const totalData = {
        ...email,
        password: data.newPassword,
      };
      const response = await changeToNewPassword(totalData);
      if (response.success) {
        toast.success("Password successfully reset!");
        navigate("/login");
      } else {
        setServerError(response.message || "password validation failed");
      }
    } catch (error) {
      setServerError(error?.response?.data?.message || "Error verifying OTP.");
    }
  };

  if (!email) return <Navigate to={"/login"} replace />;
  return (
    <LeftBox
      heading={"Enter New Password"}
      description={"Confirm your new password and login"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* New Password Field */}
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
                  "Password must be at least 8 characters long, with an uppercase letter, a lowercase letter, a number, and a special character",
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

        {/* Confirm Password Field */}
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
            <p className="text-red-500 text-sm mt-1">{passwordMatchError}</p>
          )}
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex gap-5">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            disabled={!!passwordMatchError}
          >
            Update
          </button>
          <button
            type="button"
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
            onClick={() => navigate("/login")}
          >
            Cancel
          </button>
        </div>
      </form>
    </LeftBox>
  );
}
