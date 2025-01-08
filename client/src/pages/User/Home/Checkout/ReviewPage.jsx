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
import { getAppliedCoupons } from "@/utils/couponStorage";
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
    let basePrice = item.productId.price;
    const quantity = item.quantity;

    // Add variant combination price adjustment if it exists
    if (item.variants && item.productId.variantCombinations?.length > 0) {
      const matchingCombination = item.productId.variantCombinations.find(combo => 
        Object.entries(combo.variants).every(
          ([key, value]) => item.variants[key] === value
        )
      );
      if (matchingCombination) {
        basePrice += matchingCombination.priceAdjustment || 0;
      }
    }

    // Apply product discount if any
    const discount = item.productId.discount || 0;
    const discountedPrice = basePrice * (1 - discount / 100);

    // Get coupon discount for this item if any
    const appliedCoupon = getAppliedCoupons().find(
      (coupon) => coupon.productId === item.productId._id
    );
    const couponDiscount = appliedCoupon ? appliedCoupon.couponDiscount : 0;

    return {
      basePrice: basePrice * quantity,
      discount: (basePrice * discount * quantity) / 100,
      couponDiscount,
      finalPrice: (discountedPrice * quantity) - couponDiscount,
    };
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let discount = 0;
    let couponDiscount = 0;

    cart?.items?.forEach((item) => {
      const itemPrices = calculateItemPrice(item);
      subtotal += itemPrices.basePrice;
      discount += itemPrices.discount;
      couponDiscount += itemPrices.couponDiscount;
    });

    const total = subtotal - discount - couponDiscount;
    return { subtotal, discount, couponDiscount, total };
  };

  const { subtotal, discount, couponDiscount, total } = calculateTotals();

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

      // Get applied coupons for each item
      const appliedCoupons = cart.items.map((item) => {
        const coupon = getAppliedCoupons().find(
          (c) => c.productId === item.productId._id
        );
        return coupon
          ? {
              productId: item.productId._id,
              couponCode: coupon.couponCode,
              couponDiscount: coupon.couponDiscount,
              variants: coupon.variants,
            }
          : null;
      }).filter(Boolean);

      const orderData = {
        addressId: selectedAddressId,
        paymentMethod: selectedPaymentMethod,
        items: orderItems,
        appliedCoupons,
      };

      if (selectedPaymentMethod === "cod") {
        const response = await createOrder(orderData);
        if (response.success) {
          handleOrderSuccess();
        }
      } else if (selectedPaymentMethod === "online") {
        const razorpayResponse = await createRazorpayOrder(total);
        if (!razorpayResponse.success) {
          throw new Error("Failed to create Razorpay order");
        }

        const orderResponse = await createOrder(orderData);
        if (!orderResponse.success) {
          throw new Error("Failed to create order");
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: total * 100,
          currency: "INR",
          name: "Infinora",
          description: "Payment for your order",
          order_id: razorpayResponse.order.id,
          handler: async function (response) {
            try {
              const verificationData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderResponse.orders[0]._id,
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
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to place order"
      );
      setOrderProcessing(false);
    }
  };

  const handleOrderSuccess = async () => {
    localStorage.removeItem("selectedAddress");
    localStorage.removeItem("selectedPayment");
    localStorage.removeItem("appliedCoupons");

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

            const { basePrice, discount, couponDiscount, finalPrice } =
              calculateItemPrice(item);

            const getVariantImage = () => {
              if (item.variants && item.productId.variants?.length > 0) {
                for (const [variantName, typeName] of Object.entries(
                  item.variants
                )) {
                  const variant = item.productId.variants.find(
                    (v) => v.variantName === variantName
                  );
                  const variantType = variant?.variantTypes.find(
                    (t) => t.name === typeName
                  );
                  if (typeof variantType?.imageIndex === "number") {
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
                    {item.variants &&
                      Object.entries(item.variants).map(([variantName, typeName]) => (
                        <p key={variantName}>
                          {variantName}: {typeName}
                        </p>
                      ))}
                    <p>Quantity: {item.quantity}</p>
                    <p className="text-xs">Base Price: ₹{basePrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-sm line-through text-gray-500">
                      ₹{(basePrice + discount).toFixed(2)}
                    </p>
                    <p className="font-medium">₹{finalPrice.toFixed(2)}</p>
                    {item.productId.discount > 0 && (
                      <p className="text-sm text-green-600">
                        ({item.productId.discount}% off)
                      </p>
                    )}
                    {couponDiscount > 0 && (
                      <p className="text-sm text-green-600">
                        (₹{couponDiscount.toFixed(2)} coupon discount)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 p-4 border rounded-lg space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Total Discount</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
        )}
        {couponDiscount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Total Coupon Discount</span>
            <span>-₹{couponDiscount.toFixed(2)}</span>
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