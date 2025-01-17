import { useEffect, useState } from "react";
import { getUserTempOrders, deleteTempOrder } from "@/api/order/tempOrderApi";
import { AlertCircle } from "lucide-react";
import ButtonPrimary from "@/components/Buttons/ButtonPrimary";
import { createRazorpayOrder } from "@/api/payment/paymentApi";
import { createOrder } from "@/api/order/orderApi";
import { verifyPayment } from "@/api/payment/paymentApi";
import { clearCart } from "@/api/cart/cartApi";
import { toast } from "react-hot-toast";

export default function FailedOrdersSection() {
  const [failedOrders, setFailedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchFailedOrders = async () => {
      try {
        const response = await getUserTempOrders();
        if (response.success) {
          setFailedOrders(response.data);
        }
      } catch (error) {
        console.error("Error fetching failed orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFailedOrders();
  }, []);

  const handleRetryPayment = async (order) => {
    try {
      setProcessing(true);
      const razorpayResponse = await createRazorpayOrder(order.totalAmount);

      if (!razorpayResponse.success) {
        throw new Error(razorpayResponse.message);
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.totalAmount * 100,
        currency: "INR",
        name: "Infinora",
        description: "Payment for your order",
        order_id: razorpayResponse.order.id,
        retry: {
          enabled: false,
        },
        handler: async function (response) {
          try {
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verificationResponse = await verifyPayment(verificationData);
            if (verificationResponse.success) {
              const orderResponse = await createOrder({
                items: order.items,
                addressId: order.shippingAddress,
                appliedCoupons: order.appliedCoupons,
                paymentMethod: "online",
                paymentDetails: verificationResponse.paymentDetails,
              });

              if (orderResponse.success) {
                await deleteTempOrder(order._id);
                await clearCart();
                toast.success("Order placed successfully!");
                setFailedOrders((prev) =>
                  prev.filter((o) => o._id !== order._id)
                );
              }
            }
          } catch (error) {
            console.error("Error in payment handler:", error);
            toast.error(error.message || "Failed to process payment");
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            if (!window.paymentFailed) {
              toast.error("Payment cancelled");
            }
            window.paymentFailed = false;
          },
          escape: true,
          animation: true,
        },
        prefill: {
          name: order.shippingAddress?.name || "",
          contact: order.shippingAddress?.phone || "",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const handlePaymentFailed = async function (response) {
        console.log("Payment failed event triggered", response);
        window.paymentFailed = true;
        toast.error("Payment failed. Please try again.");
        razorpayInstance.off("payment.failed", handlePaymentFailed);
        setProcessing(false);
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.off("payment.failed");
      razorpayInstance.on("payment.failed", handlePaymentFailed);
      razorpayInstance.open();
    } catch (error) {
      console.error("Error retrying payment:", error);
      toast.error(error.message || "Failed to retry payment");
      setProcessing(false);
    }
  };

  if (loading) return null;
  if (!failedOrders.length) return null;

  return (
    <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="text-red-500" />
        <h2 className="text-lg font-semibold text-red-700">Failed Orders</h2>
      </div>

      <div className="space-y-4">
        {failedOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-4 rounded-md border border-red-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">Order ID: {order.razorpayOrderId}</p>
                <p className="text-sm text-gray-600">
                  Amount: ₹{order.totalAmount}
                </p>
              </div>
              <ButtonPrimary
                onClick={() => handleRetryPayment(order)}
                disabled={processing}
              >
                {processing ? "Processing..." : "Retry Payment"}
              </ButtonPrimary>
            </div>
            <div className="text-sm text-gray-500">
              {order.items.length} items • Failed on{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
