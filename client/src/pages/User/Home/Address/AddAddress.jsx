import { addAddress } from "@/api/address/addressApi";
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AddAddress() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const { user, loading, error, refreshUser } = useUser();

  const onSubmit = async (data) => {
    try {
      const dataObj = { userId: user._id, ...data };
      const response = await addAddress(dataObj);
      console.log("Response: " ,response)
      if (response.success) {
        toast.success("Address added successfully!");
        navigate("/home/profile/address");
      } else {
        toast.error("Address adding failed");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 max-w-xl mx-auto p-6"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Add Address
        </h2>

        <div className="space-y-4">
          {/* Full Name and Mobile Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-medium"
              >
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                {...register("name", { required: "Name is required" })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-gray-700 text-sm font-medium"
              >
                Mobile Number
              </label>
              <input
                type="text"
                placeholder="Enter your mobile number"
                {...register("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Enter a valid phone number",
                  },
                })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Pincode and Locality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="pincode"
                className="block text-gray-700 text-sm font-medium"
              >
                Pincode
              </label>
              <input
                type="text"
                placeholder="Enter your pincode"
                {...register("pincode", {
                  required: "Pincode is required",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Enter a valid 6-digit pincode",
                  },
                })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              />
              {errors.pincode && (
                <p className="text-red-500 text-sm">{errors.pincode.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="locality"
                className="block text-gray-700 text-sm font-medium"
              >
                Locality
              </label>
              <input
                type="text"
                placeholder="Enter your locality"
                {...register("locality", { required: "Locality is required" })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              />
              {errors.locality && (
                <p className="text-red-500 text-sm">
                  {errors.locality.message}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-gray-700 text-sm font-medium"
            >
              Address (Area and Street)
            </label>
            <textarea
              placeholder="Enter your full address"
              {...register("address", { required: "Address is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              rows="3"
            ></textarea>
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          {/* District and State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="district"
                className="block text-gray-700 text-sm font-medium"
              >
                District
              </label>
              <input
                type="text"
                placeholder="Enter your district"
                {...register("district", { required: "District is required" })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              />
              {errors.district && (
                <p className="text-red-500 text-sm">
                  {errors.district.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-gray-700 text-sm font-medium"
              >
                State
              </label>
              <input
                type="text"
                placeholder="Enter your state"
                {...register("state", { required: "State is required" })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              />
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => console.log("Cancelled")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
