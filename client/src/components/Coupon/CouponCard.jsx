import React from "react";
import { formatDate } from "@/lib/utils";

export default function CouponCard({ coupon }) {
  const {
    name,
    code,
    description,
    discountType,
    discountValue,
    minimumAmount,
    maximumDiscountAmount,
    userRestriction,
    maxUses,
    totalUses,
    isActive,
    createdAt,
  } = coupon;
  console.log()
  return (
    <div className={`bg-white rounded-lg shadow-md p-8 ${!isActive && 'opacity-60'} h-[300px]`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Code</span>
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{code}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Discount</span>
          <span className="text-sm">
            {discountValue}{discountType === 'percentage' ? '%' : '₹'} off
            {maximumDiscountAmount && ` up to ₹${maximumDiscountAmount}`}
          </span>
        </div>

        {minimumAmount && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Min. Purchase</span>
            <span className="text-sm">₹{minimumAmount}</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Usage</span>
          <span className="text-sm">{totalUses} / {maxUses || '∞'}</span>
        </div>

        {userRestriction?.newUsersOnly && (
          <div className="mt-2">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              New Users Only
            </span>
          </div>
        )}

        <div className="text-xs text-gray-400 mt-4">
          Created on {formatDate(createdAt)}
        </div>
      </div>
    </div>
  );
}