import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ButtonPrimary from "@/components/Buttons/ButtonPrimary";
import { MapPin, Banknote, ShoppingBag } from "lucide-react";
import AddedAddress from "@/components/Address/AddedAddress";
import { fetchUserAddresses } from "@/redux/features/userAddressSlice";
import { fetchUserCart } from "@/redux/features/userCartSlice";
import { clearCart } from "@/redux/features/userCartSlice";
import { clearCheckout } from "@/redux/features/userOrderSlice";
import Spinner from "@/components/Spinner/Spinner";
import { createOrder } from "@/api/order/orderApi";
import { createRazorpayOrder, verifyPayment } from "@/api/payment/paymentApi";
import toast from "react-hot-toast";
import axios from "axios";

export default function ReviewPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.userCart);
  const { addresses } = useSelector((state) => state.userAddresses);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orderProcessing, setOrderProcessing] = useState(false);

  const calculateItemPrice = (item) => {
    if (!item?.productId) return { basePrice: 0, totalPrice: 0, discountedPrice: 0 };

    try {
      // Start with base product price
      let basePrice = item.productId.price || 0;

      // Add variant prices if any
      if (item.variants && item.productId.variants?.length > 0) {
        for (const [variantName, typeName] of Object.entries(item.variants)) {
          const variant = item.productId.variants.find(v => v.variantName === variantName);
          const variantType = variant?.variantTypes.find(t => t.name === typeName);
          if (variantType?.price) {
            basePrice += variantType.price;
          }
        }
      }

      const totalPrice = basePrice * item.quantity;
      const discount = (totalPrice * (item.productId.discount || 0)) / 100;
      const discountedPrice = totalPrice - discount;

      return { basePrice, totalPrice, discountedPrice };
    } catch (error) {
      console.error("Error calculating item price:", error);
      return { basePrice: 0, totalPrice: 0, discountedPrice: 0 };
    }
  };

  const calculateTotals = () => {
    if (!cart?.items?.length) return { subtotal: 0, discount: 0, total: 0 };

    return cart.items.reduce(
      (acc, item) => {
        const { totalPrice, discountedPrice } = calculateItemPrice(item);
        return {
          subtotal: acc.subtotal + totalPrice,
          discount: acc.discount + (totalPrice - discountedPrice),
          total: acc.total + discountedPrice,
        };
      },
      { subtotal: 0, discount: 0, total: 0 }
    );
  };

  const { subtotal, discount, total } = calculateTotals();

  useEffect(() => {
    dispatch(fetchUserCart());
    dispatch(fetchUserAddresses());

    const selectedAddressId = localStorage.getItem("selectedAddress");
    const selectedPaymentMethod = localStorage.getItem("selectedPayment");

    if (!selectedAddressId || !selectedPaymentMethod) {
      navigate("/home/checkout/delivery");
      return;
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    const selectedAddressId = localStorage.getItem("selectedAddress");
    if (selectedAddressId && addresses.length > 0) {
      const address = addresses.find((addr) => addr._id === selectedAddressId);
      setSelectedAddress(address);
    }
  }, [addresses]);

  const handlePlaceOrder = async () => {
    const selectedAddressId = localStorage.getItem("selectedAddress");
    const selectedPaymentMethod = localStorage.getItem("selectedPayment");

    if (!selectedAddressId || !selectedPaymentMethod || orderProcessing) {
      toast.error("Please select delivery address and payment method");
      return;
    }

    if (!cart?.items?.length) {
      toast.error("Your cart is empty");
      return;
    }

    setOrderProcessing(true);
    try {
      const orderItems = cart.items
        .map((item) => {
          if (!item.productId) return null;
          return {
            productId: item.productId._id,
            quantity: item.quantity,
            variants: item.variants || {},
          };
        })
        .filter(Boolean);

      if (orderItems.length === 0) {
        toast.error("No valid items in cart");
        return;
      }

      const orderData = {
        addressId: selectedAddressId,
        paymentMethod: selectedPaymentMethod,
        items: orderItems,
      };

      if (selectedPaymentMethod === "cod") {
        // Handle COD payment
        const response = await createOrder(orderData);
        if (response.success) {
          handleOrderSuccess();
        }
      } else if (selectedPaymentMethod === "online") {
        // Create Razorpay order
        const razorpayResponse = await createRazorpayOrder(total);
        if (!razorpayResponse.success) {
          throw new Error("Failed to create Razorpay order");
        }

        // Create order in your system first
        const orderResponse = await createOrder(orderData);
        if (!orderResponse.success) {
          throw new Error("Failed to create order");
        }

        // Initialize Razorpay payment
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: total * 100, // amount in paise
          currency: "INR",
          name: "Infinora",
          description: "Payment for your order",
          order_id: razorpayResponse.order.id,
          handler: async function (response) {
            try {
              // Verify payment
              const verificationData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderResponse.orders[0]._id, // Assuming single order
              };

              const verificationResponse = await verifyPayment(verificationData);
              if (verificationResponse.success) {
                handleOrderSuccess();
              } else {
                throw new Error("Payment verification failed");
              }
            } catch (error) {
              toast.error("Payment verification failed");
              setOrderProcessing(false);
            }
          },
          prefill: {
            name: selectedAddress?.fullName || "",
            contact: selectedAddress?.phone || "",
          },
          theme: {
            color: "#2563eb",
          },
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error.message || "Failed to place order");
      setOrderProcessing(false);
    }
  };

  const handleOrderSuccess = async () => {
    localStorage.removeItem("selectedAddress");
    localStorage.removeItem("selectedPayment");

    dispatch(clearCart());
    dispatch(clearCheckout());

    await axios.delete(
      `${import.meta.env.VITE_USERS_API_BASE_URL}/api/cart/clear`,
      {
        withCredentials: true,
      }
    );

    toast.success("Order placed successfully!");
    navigate("/home/profile/orders", { replace: true });
  };

  if (orderProcessing) return <Spinner />;

  if (!cart?.items?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-4">
        <p className="text-gray-500">Your cart is empty</p>
        <ButtonPrimary onClick={() => navigate("/home")}>
          Continue Shopping
        </ButtonPrimary>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <MapPin className="w-5 h-5" />
            <h2>Delivery Address</h2>
          </div>
          {selectedAddress && <AddedAddress address={selectedAddress} />}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Banknote className="w-5 h-5" />
            <h2>Payment Method</h2>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="capitalize">
              {localStorage.getItem("selectedPayment")}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <ShoppingBag className="w-5 h-5" />
          <h2>Order Items</h2>
        </div>
        <div className="space-y-4">
          {cart?.items?.map((item, index) => {
            if (!item.productId) return null;

            const { basePrice, totalPrice, discountedPrice } = calculateItemPrice(item);

            const getVariantImage = () => {
              if (item.variants && item.productId.variants?.length > 0) {
                for (const [variantName, typeName] of Object.entries(item.variants)) {
                  const variant = item.productId.variants.find(v => v.variantName === variantName);
                  const variantType = variant?.variantTypes.find(t => t.name === typeName);
                  if (typeof variantType?.imageIndex === 'number') {
                    return item.productId.images[variantType.imageIndex] || item.productId.images[0];
                  }
                }
              }
              return item.productId.images[0];
            };

            return (
              <div
                key={item.productId._id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <img
                  src={getVariantImage()}
                  alt={item.productId.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.productId.name}</h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    {item.variants && Object.entries(item.variants).map(([variantName, typeName]) => (
                      <p key={variantName}>
                        {variantName}: {typeName}
                      </p>
                    ))}
                    <p>Quantity: {item.quantity}</p>
                    <p className="text-xs">Base Price: ₹{basePrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-sm line-through text-gray-500">
                      ₹{totalPrice.toFixed(2)}
                    </p>
                    <p className="font-medium">₹{discountedPrice.toFixed(2)}</p>
                    {item.productId.discount > 0 && (
                      <p className="text-sm text-green-600">
                        ({item.productId.discount}% off)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal ({cart.items.length} items)</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Total Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-lg pt-2">
          <span>Total Amount</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <ButtonPrimary
          onClick={handlePlaceOrder}
          disabled={
            !selectedAddress ||
            !localStorage.getItem("selectedPayment") ||
            orderProcessing
          }
        >
          Place Order
        </ButtonPrimary>
      </div>
    </div>
  );
}
