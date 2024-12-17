import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Calendar,
  IndianRupee,
  AlertCircle,
  Truck,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Modal from "@/components/Modal/Modal";
import toast from "react-hot-toast";

const STATUS_STYLES = {
  pending: {
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    border: "border-yellow-200",
  },
  processing: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
  },
  shipped: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-200",
  },
  delivered: {
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-200",
  },
  cancelled: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
  },
};

export default function OrderCard({ order }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const navigate = useNavigate();

  const statusStyle =
    STATUS_STYLES[order.status.toLowerCase()] || STATUS_STYLES.pending;

  const handleCancelOrder = async () => {
    try {
      // TODO: Implement cancel order API call
      toast.success("Order cancelled successfully");
      setIsCancelModalOpen(false);
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-all shadow-sm">
      {/* Order Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="h-4 w-4" />
            <span>Order ID: </span>
            <span className="font-medium">{order.orderId}</span>
          </div>
          <div
            className={`px-3 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} text-sm font-medium border`}
          >
            {order.status}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-lg overflow-hidden cursor-pointer bg-gray-50"
            onClick={() => navigate(`/home/product/${order.productId}`)}
          >
            <img
              src={
                order.product.images[order.selectedVariant] ||
                order.product.images[0]
              }
              alt={order.product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1">
            <h3
              className="font-medium text-lg hover:text-primary cursor-pointer transition-colors"
              onClick={() => navigate(`/home/product/${order.productId}`)}
            >
              {order.product.name}
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                {`${order.product.variant.variantName}: ${
                  order.product.variant.variantTypes[order.selectedVariant].name
                }`}
              </div>
              <div>Quantity: {order.quantity}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <IndianRupee className="h-4 w-4" />
              <span className="font-semibold text-lg">
                {order.finalPrice.toFixed(2)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="text-sm">
                <span className="text-gray-500 line-through">
                  ₹{order.originalPrice.toFixed(2)}
                </span>
                <span className="text-green-600 ml-2">
                  {order.discount}% off
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Ordered on: </span>
            <span className="font-medium">
              {format(new Date(order.createdAt), "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span>Expected by: </span>
            <span className="font-medium">
              {format(
                new Date(order.shipping.expectedDeliveryDate),
                "MMM d, yyyy"
              )}
            </span>
          </div>
        </div>

        {/* Expandable Section */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium w-full justify-center mt-2"
        >
          {isExpanded ? "Show Less" : "Show More Details"}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {/* Extended Details */}
        {isExpanded && (
          <div className="pt-3 border-t border-gray-100 space-y-4 text-sm">
            {/* Payment Details */}
            <div>
              <h4 className="font-medium mb-2">Payment Details</h4>
              <div className="grid grid-cols-2 gap-2 text-gray-600">
                <div>
                  Method:{" "}
                  <span className="font-medium">{order.payment.method}</span>
                </div>
                <div>
                  Status:{" "}
                  <span className="font-medium">{order.payment.status}</span>
                </div>
                {order.payment.transactionId && (
                  <div className="col-span-2">
                    Transaction ID:{" "}
                    <span className="font-medium">
                      {order.payment.transactionId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Details */}
            <div>
              <h4 className="font-medium mb-2">Shipping Details</h4>
              <div className="grid grid-cols-2 gap-2 text-gray-600">
                <div>
                  Partner:{" "}
                  <span className="font-medium">{order.shipping.partner}</span>
                </div>
                {order.shipping.trackingId && (
                  <div>
                    Tracking ID:{" "}
                    <span className="font-medium">
                      {order.shipping.trackingId}
                    </span>
                  </div>
                )}
                {order.shipping.actualDeliveryDate && (
                  <div>
                    Delivered on:{" "}
                    <span className="font-medium">
                      {format(
                        new Date(order.shipping.actualDeliveryDate),
                        "MMM d, yyyy"
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {order.status.toLowerCase() === "pending" && (
          <div className="flex items-center justify-end border-t border-gray-100 pt-3">
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
            >
              Cancel Order
            </button>
          </div>
        )}
      </div>

      {/* Cancel Order Modal */}
      <Modal isOpen={isCancelModalOpen}>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Cancel Order</h3>
          </div>
          <p className="text-gray-600">
            Are you sure you want to cancel this order? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              onClick={() => setIsCancelModalOpen(false)}
            >
              Keep Order
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
              onClick={handleCancelOrder}
            >
              Cancel Order
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
