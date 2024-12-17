import { formatDate, formatPrice } from "@/lib/utils";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

const orderStatusIcons = {
  pending: <Clock className="h-5 w-5 text-yellow-500" />,
  processing: <Package className="h-5 w-5 text-blue-500" />,
  shipped: <Truck className="h-5 w-5 text-purple-500" />,
  delivered: <CheckCircle className="h-5 w-5 text-green-500" />,
  cancelled: <XCircle className="h-5 w-5 text-red-500" />,
};

const orderStatusColors = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function OrderCard({ order }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Order Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-medium">{order.orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Ordered On</p>
            <p className="font-medium">{formatDate(order.orderDate)}</p>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex items-start gap-4">
        <div className="h-24 w-24 flex-shrink-0">
          <img
            src={order.product.images[order.selectedVariant]}
            alt={order.product.name}
            className="h-full w-full object-cover rounded-md"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">
            {order.product.name}
          </h3>
          <p className="text-sm text-gray-500">
            {order.product.variant.variantName}:{" "}
            {order.product.variant.variantTypes[order.selectedVariant].name}
          </p>
          <p className="text-sm text-gray-500">Quantity: {order.quantity}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-medium">
              {formatPrice(order.totalAmount)}
            </span>
            {order.discount > 0 && (
              <span className="text-sm text-green-600">
                {order.discount}% off
              </span>
            )}
          </div>
        </div>
        <div>
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border ${
              orderStatusColors[order.status]
            }`}
          >
            {orderStatusIcons[order.status]}
            <span className="capitalize">{order.status}</span>
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      <div className="border-t">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 flex items-center justify-center gap-1"
        >
          {isExpanded ? "Show Less" : "Show More"}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Extended Details */}
      {isExpanded && (
        <div className="border-t p-4 space-y-4">
          {/* Payment Details */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Payment Method</p>
                <p className="font-medium capitalize">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-medium capitalize">{order.status}</p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
            <div className="text-sm space-y-1">
              <p className="font-medium">{order.address.fullName}</p>
              <p>{order.address.address}</p>
              <p>
                {order.address.locality}, {order.address.district}
              </p>
              <p>
                {order.address.state} - {order.address.pincode}
              </p>
              <p>Phone: {order.address.phoneNumber}</p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Price Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Price ({order.quantity} items)
                </span>
                <span>{formatPrice(order.price * order.quantity)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({order.discount}%)</span>
                  <span>
                    -{" "}
                    {formatPrice(
                      (order.price * order.quantity * order.discount) / 100
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Total Amount</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
