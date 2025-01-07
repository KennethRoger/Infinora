import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import { createCoupon, updateCouponStatus } from "@/api/coupon/couponApi";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchVendorCoupons } from "@/redux/features/vendorCouponSlice";
import CouponCard from "@/components/Coupon/CouponCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
export default function CouponPage() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { coupons, loading, error } = useSelector(
    (state) => state.vendorCoupons
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const discountType = watch("discountType");

  const handleToggleState = async (couponId, currentStatus) => {
    try {
      const response = await updateCouponStatus(couponId, { isActive: !currentStatus });
      if (response.success) {
        toast.success("Coupon status updated successfully");
        dispatch(fetchVendorCoupons());
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update coupon");
    }
  };

  const onSubmit = async (data) => {
    try {
      await createCoupon(data);
      toast.success("Coupon created successfully!");
      setIsModalOpen(false);
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create coupon");
    }
  };

  useEffect(() => {
    dispatch(fetchVendorCoupons());
  }, [dispatch]);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          coupons.map((coupon) => (
            <div key={coupon._id} className="relative">
              <CouponCard coupon={coupon} />
              <div className="absolute top-0 right-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className={
                        coupon.isActive ? "text-red-600" : "text-green-600"
                      }
                      onClick={() => handleToggleState(coupon._id, coupon.isActive)}
                    >
                      {coupon.isActive
                        ? "Deactivate coupon"
                        : "Activate coupon"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen}>
        <div className="">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Coupon
            </h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: "Required" })}
                    className="block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    placeholder="Enter coupon name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code
                  </label>
                  <input
                    type="text"
                    {...register("code", {
                      required: "Required",
                      pattern: {
                        value: /^[A-Za-z0-9]+$/,
                        message: "Letters & numbers only",
                      },
                    })}
                    className="block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    placeholder="e.g., SUMMER2025"
                  />
                  {errors.code && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.code.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows="2"
                  className="block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  placeholder="Brief description of the coupon"
                />
              </div>
            </div>

            {/* Discount Details */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  {...register("discountType", { required: "Required" })}
                  className="block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select type</option>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
                {errors.discountType && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.discountType.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount {discountType === "percentage" ? "(%)" : "(₹)"}
                </label>
                <input
                  type="number"
                  {...register("discountValue", {
                    required: "Required",
                    min: { value: 0, message: "Must be positive" },
                  })}
                  className="block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
                {errors.discountValue && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.discountValue.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Redeemable Amount
                </label>
                <input
                  type="number"
                  {...register("maximumDiscountAmount")}
                  className="block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Requirements */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Min Purchase (₹)
                </label>
                <input
                  type="number"
                  {...register("minimumAmount")}
                  className="block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Usage Limits */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Uses Per User
                  </label>
                  <input
                    type="number"
                    {...register("maxUsesPerUser", {
                      required: "Required",
                      min: { value: 1, message: "Minimum 1" },
                    })}
                    className="block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  />
                  {errors.maxUsesPerUser && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.maxUsesPerUser.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Platform Uses
                  </label>
                  <input
                    type="number"
                    {...register("maxUses", {
                      min: { value: 0, message: "Cannot be negative" },
                    })}
                    placeholder="Optional"
                    className="block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  />
                  {errors.maxUses && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.maxUses.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("newUsersOnly")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  New Users Only
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isSubmitting ? "Creating..." : "Create Coupon"}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
