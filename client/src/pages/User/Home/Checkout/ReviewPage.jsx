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
import toast from "react-hot-toast";
import axios from "axios";

export default function ReviewPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.userCart);
  const { addresses } = useSelector((state) => state.userAddresses);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orderProcessing, setOrderProcessing] = useState(false);

  const calculateTotals = () => {
    if (!cart?.items?.length) return { subtotal: 0, discount: 0, total: 0 };

    return cart.items.reduce(
      (acc, item) => {
        if (!item.productId) return acc;

        try {
          let itemBasePrice = 0;

          if (item.selectedVariants?.length > 0) {
            itemBasePrice = item.selectedVariants.reduce(
              (total, selectedVariant) => {
                const variant = item.productId.productVariants.find(
                  (v) => v.variantName === selectedVariant.variantName
                );
                const variantType = variant?.variantTypes.find(
                  (t) => t.name === selectedVariant.typeName
                );
                return total + (variantType?.price || 0);
              },
              0
            );
          } else {
            itemBasePrice = item.productId.price || 0;
          }

          const itemTotalBasePrice = itemBasePrice * item.quantity;
          const itemDiscount =
            (itemTotalBasePrice * (item.productId.discount || 0)) / 100;
          const itemFinalPrice = itemTotalBasePrice - itemDiscount;

          return {
            subtotal: acc.subtotal + itemTotalBasePrice,
            discount: acc.discount + itemDiscount,
            total: acc.total + itemFinalPrice,
          };
        } catch (error) {
          console.error("Error calculating totals:", error);
          return acc;
        }
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
      console.log(cart.items);
      const orderItems = cart.items
        .map((item) => {
          if (!item.productId) return null;
          return {
            productId: item.productId._id,
            quantity: item.quantity,
            selectedVariants: item.selectedVariants
              ? item.selectedVariants.map((variant) => ({
                  variantName: variant.variantName,
                  typeName: variant.typeName,
                }))
              : [],
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
      console.log(orderData);

      const response = await createOrder(orderData);
      console.log(response);

      if (response.success) {
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
      } else {
        toast.error(response.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setOrderProcessing(false);
    }
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

            let itemBasePrice = 0;

            if (item?.selectedVariants?.length > 0) {
              itemBasePrice = item.selectedVariants.reduce(
                (total, selectedVariant) => {
                  const variant = item.productId.productVariants.find(
                    (v) => v.variantName === selectedVariant.variantName
                  );
                  const variantType = variant?.variantTypes.find(
                    (t) => t.name === selectedVariant.typeName
                  );
                  return total + (variantType?.price || 0);
                },
                0
              );
            } else {
              itemBasePrice = item.productId.price || 0;
            }

            const totalPrice = itemBasePrice * item.quantity;
            const discountedPrice =
              totalPrice * (1 - (item.productId.discount || 0) / 100);

            return (
              <div
                key={item.productId._id}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <img
                  src={item.productId.images[0]}
                  alt={item.productId.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.productId.name}</h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    {item.selectedVariants && item.selectedVariants.map((variant) => (
                      <p key={variant._id}>
                        {variant.variantName}: {variant.typeName}
                      </p>
                    ))}
                    <p>Quantity: {item.quantity}</p>
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
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-₹{discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
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
