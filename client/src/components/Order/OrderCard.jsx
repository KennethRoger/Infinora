import { formatDate, formatPrice } from "@/lib/utils";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import { cancelOrder } from "@/api/order/orderApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchUserOrders } from "@/redux/features/userOrderSlice";

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

const paymentStatusColors = {
  pending: "bg-yellow-50 text-yellow-700",
  completed: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
};

export default function OrderCard({ order, showPaymentStatus = false, showDeliveryStatus = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const dispatch = useDispatch();

  const handleCancel = async () => {
    try {
      setCancelling(true);
      await cancelOrder(order._id);
      toast.success("Order cancelled successfully");
      setShowCancelModal(false);
      dispatch(fetchUserOrders());
    } catch (error) {
      toast.error(error.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium">Order #{order.orderId}</h3>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                orderStatusColors[order.status]
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            {showPaymentStatus && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  paymentStatusColors[order.paymentStatus]
                }`}
              >
                <div className="flex items-center gap-1">
                  <CreditCard className="h-3 w-3" />
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </div>
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Ordered on {formatDate(order.createdAt)}
          </p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <img
          src={order.product.images[0]}
          alt={order.product.name}
          className="h-20 w-20 object-cover rounded-md"
        />
        <div>
          <h4 className="font-medium">{order.product.name}</h4>
          <p className="text-sm text-gray-500">Quantity: {order.quantity}</p>
          {order.variants && Object.keys(order.variants).length > 0 && (
            <p className="text-sm text-gray-500">
              Variants:{" "}
              {Object.entries(order.variants)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")}
            </p>
          )}
          <p className="font-medium mt-1">{formatPrice(order.totalAmount)}</p>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium mb-2">Delivery Address</h5>
              <div className="text-sm text-gray-600">
                <p>{order.address.fullName}</p>
                <p>{order.address.street}</p>
                <p>
                  {order.address.city}, {order.address.state} {order.address.pinCode}
                </p>
                <p>Phone: {order.address.phone}</p>
              </div>
            </div>
            <div>
              <h5 className="font-medium mb-2">Payment Details</h5>
              <div className="text-sm text-gray-600">
                <p>Method: {order.paymentMethod.toUpperCase()}</p>
                {order.paymentMethod === "online" && (
                  <>
                    <p>Status: {order.paymentStatus}</p>
                    {order.razorpay?.paymentId && (
                      <p>Payment ID: {order.razorpay.paymentId}</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {showDeliveryStatus && (
            <div className="mt-4">
              <h5 className="font-medium mb-2">Order Timeline</h5>
              <div className="flex items-center justify-between text-sm">
                <div className="flex flex-col items-center">
                  <Clock className={`h-5 w-5 ${order.status === "pending" ? "text-blue-500" : "text-gray-400"}`} />
                  <span>Pending</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
                <div className="flex flex-col items-center">
                  <Package className={`h-5 w-5 ${order.status === "processing" ? "text-blue-500" : "text-gray-400"}`} />
                  <span>Processing</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
                <div className="flex flex-col items-center">
                  <Truck className={`h-5 w-5 ${order.status === "shipped" ? "text-blue-500" : "text-gray-400"}`} />
                  <span>Shipped</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
                <div className="flex flex-col items-center">
                  <CheckCircle className={`h-5 w-5 ${order.status === "delivered" ? "text-blue-500" : "text-gray-400"}`} />
                  <span>Delivered</span>
                </div>
              </div>
            </div>
          )}

          {order.status !== "cancelled" && order.status !== "delivered" && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowCancelModal(true)}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Order"
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <p>Are you sure you want to cancel this order?</p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowCancelModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              disabled={cancelling}
            >
              No, Keep Order
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
              disabled={cancelling}
            >
              {cancelling ? "Cancelling..." : "Yes, Cancel Order"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
