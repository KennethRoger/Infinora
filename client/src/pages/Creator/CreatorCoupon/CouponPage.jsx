import { useForm } from "react-hook-form";
import { useUser } from "@/context/UserContext";
import toast from "react-hot-toast";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";

export default function CouponPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const { user } = useUser();
  const discountType = watch("discountType");

  const onSubmit = async (data) => {
    try {
      // API call will be implemented later
      console.log({ ...data, vendorId: user._id });
      toast.success("Coupon created successfully!");
      setIsModalOpen(false);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create coupon");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Coupon
        </button>
      </div>

      {/* Coupon list will be added here later */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Coupon cards will be mapped here */}
      </div>

      <Modal isOpen={isModalOpen}>
        <div className="relative">
          <h2 className="text-2xl font-semibold text-center mb-6">Create New Coupon</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Coupon Name</label>
                <input
                  type="text"
                  {...register("name", { required: "Coupon name is required" })}
                  className="w-full p-2 border rounded"
                  placeholder="Enter coupon name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Coupon Code</label>
                <input
                  type="text"
                  {...register("code", {
                    required: "Coupon code is required",
                    pattern: {
                      value: /^[A-Za-z0-9]+$/,
                      message: "Only letters and numbers allowed",
                    },
                  })}
                  className="w-full p-2 border rounded"
                  placeholder="Enter coupon code"
                />
                {errors.code && (
                  <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  {...register("description")}
                  className="w-full p-2 border rounded"
                  rows="3"
                  placeholder="Enter description"
                />
              </div>
            </div>

            {/* Discount Settings */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Discount Type</label>
                <select
                  {...register("discountType", { required: "Select discount type" })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select type</option>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
                {errors.discountType && (
                  <p className="text-red-500 text-sm mt-1">{errors.discountType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Discount Value {discountType === "percentage" ? "(%)" : "(₹)"}
                </label>
                <input
                  type="number"
                  {...register("discountValue", {
                    required: "Discount value is required",
                    min: { value: 0, message: "Must be positive" },
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.discountValue && (
                  <p className="text-red-500 text-sm mt-1">{errors.discountValue.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Maximum Discount (₹)</label>
                <input
                  type="number"
                  {...register("maximumDiscount")}
                  className="w-full p-2 border rounded"
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Purchase Requirements */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Minimum Purchase Amount</label>
                <input
                  type="number"
                  {...register("minimumPurchase.maximumAmount")}
                  className="w-full p-2 border rounded"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Maximum Orders</label>
                <input
                  type="number"
                  {...register("minimumPurchase.maximumOrders")}
                  className="w-full p-2 border rounded"
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Usage Restrictions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("newUsersOnly")}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">New Users Only</label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Uses Per User</label>
                <input
                  type="number"
                  {...register("maxUsesPerUser", {
                    required: "Required",
                    min: { value: 1, message: "Minimum 1" },
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.maxUsesPerUser && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxUsesPerUser.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Total Platform Uses</label>
                <input
                  type="number"
                  {...register("maxUses", {
                    required: "Required",
                    min: { value: 0, message: "Cannot be negative" },
                  })}
                  className="w-full p-2 border rounded"
                />
                {errors.maxUses && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxUses.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? "Creating..." : "Create Coupon"}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
