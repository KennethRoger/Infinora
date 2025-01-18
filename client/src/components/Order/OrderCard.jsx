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
  X,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";
import Modal from "@/components/Modal/Modal";
import { cancelOrder, returnOrder, cancelReturnRequest } from "@/api/order/orderApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchUserOrders } from "@/redux/features/userOrderSlice";
import { downloadInvoice } from "@/utils/invoice";

const orderStatusColors = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  return_requested: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

export default function OrderCard({ order, showDeliveryStatus = false }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showCancelReturnModal, setShowCancelReturnModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [returning, setReturning] = useState(false);
  const [cancellingReturn, setCancellingReturn] = useState(false);
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

  const handleReturnOrder = async () => {
    setReturning(true);
    try {
      await returnOrder(order._id);
      toast.success("Return request submitted successfully");
      setShowReturnModal(false);
      dispatch(fetchUserOrders());
    } catch (error) {
      toast.error(error.message || "Failed to submit return request");
    } finally {
      setReturning(false);
    }
  };

  const handleCancelReturnRequest = async () => {
    setCancellingReturn(true);
    try {
      await cancelReturnRequest(order._id);
      toast.success("Return request cancelled successfully");
      setShowCancelReturnModal(false);
      dispatch(fetchUserOrders());
    } catch (error) {
      toast.error(error.message || "Failed to cancel return request");
    } finally {
      setCancellingReturn(false);
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
              <h5 className="font-medium mb-2">Shipping Address</h5>
              <div className="text-sm text-gray-600">
                <p>{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.locality}, {order.shippingAddress.city}
                </p>
                <p>
                  {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
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

          {order.status !== "cancelled" && (
          <div className="mt-4 flex gap-5 justify-end">
            <button
              onClick={() => downloadInvoice(order)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586L7.707 10.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                  clipRule="evenodd"
                />
              </svg>
              Download Invoice
            </button>
            {order.status === "delivered" ? (
              <button
                onClick={() => setShowReturnModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
              >
                <RotateCcw className="h-4 w-4" />
                Return Order
              </button>
            ) : order.status === "return_requested" ? (
              <button
                onClick={() => setShowCancelReturnModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
                Cancel Return Request
              </button>
            ) : (
              <button
                onClick={() => setShowCancelModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
                Cancel Order
              </button>
            )}
          </div>
          )}
        </div>
      )}

      {/* Cancel Order Modal */}
      <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} title="Cancel Order">
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

      {/* Return Order Modal */}
      <Modal isOpen={showReturnModal} onClose={() => setShowReturnModal(false)} title="Return Order">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <p>Would you like to initiate a return for this order?</p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowReturnModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              disabled={returning}
            >
              No, Keep Order
            </button>
            <button
              onClick={handleReturnOrder}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md disabled:opacity-50"
              disabled={returning}
            >
              {returning ? "Processing..." : "Yes, Return Order"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Cancel Return Request Modal */}
      <Modal isOpen={showCancelReturnModal} onClose={() => setShowCancelReturnModal(false)} title="Cancel Return Request">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            <p>Are you sure you want to cancel your return request?</p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowCancelReturnModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              disabled={cancellingReturn}
            >
              No, Keep Request
            </button>
            <button
              onClick={handleCancelReturnRequest}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md disabled:opacity-50"
              disabled={cancellingReturn}
            >
              {cancellingReturn ? "Cancelling..." : "Yes, Cancel Request"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
