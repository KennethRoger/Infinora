import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ButtonPrimary from "@/components/Buttons/ButtonPrimary";
import { MapPin, Banknote, ShoppingBag } from "lucide-react";
import AddedAddress from "@/components/Address/AddedAddress";
import { fetchUserAddresses } from "@/redux/features/userAddressSlice";
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
  const { checkout } = useSelector((state) => state.userOrder);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [orderProcessing, setOrderProcessing] = useState(false);

  useEffect(() => {
    dispatch(fetchUserAddresses());
  }, [dispatch]);

  useEffect(() => {
    const address = addresses.find(
      (addr) => addr._id === checkout.selectedAddressId
    );
    setSelectedAddress(address);
  }, [addresses, checkout.selectedAddressId]);

  const totals = cart?.items?.reduce(
    (acc, item) => {
      const originalPrice =
        item.product.variant.variantTypes[item.selectedVariant].price *
        item.quantity;
      const discountedPrice = originalPrice * (1 - item.product.discount / 100);

      return {
        originalTotal: acc.originalTotal + originalPrice,
        discountedTotal: acc.discountedTotal + discountedPrice,
      };
    },
    { originalTotal: 0, discountedTotal: 0 }
  ) || { originalTotal: 0, discountedTotal: 0 };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !checkout.selectedPaymentMethod || orderProcessing)
      return;

    setOrderProcessing(true);
    try {

      const orderItems = cart.items.map((item) => {
        const itemPrice =
          item.product.variant.variantTypes[item.selectedVariant].price;
        const totalAmount =
          itemPrice * item.quantity * (1 - item.product.discount / 100);

        return {
          productId: item.product._id,
          variantId: item.product.variant._id,
          selectedVariant: item.selectedVariant,
          quantity: item.quantity,
          price: itemPrice,
          discount: item.product.discount,
        };
      });

      const orderData = {
        addressId: selectedAddress._id,
        paymentMethod: checkout.selectedPaymentMethod,
        items: orderItems,
      };

      const response = await createOrder(orderData);

      dispatch(clearCart());
      dispatch(clearCheckout());

      await axios.delete(
        `${import.meta.env.VITE_USERS_API_BASE_URL}/api/cart/clear`,
        {
          withCredentials: true,
        }
      );

      toast.success("Orders placed successfully!");

      navigate("/home/profile/orders", { replace: true });
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setOrderProcessing(false);
    }
  };

  if (orderProcessing) return <Spinner />;

  return (
    <div className="space-y-8">
      {/* Delivery Address */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold">Delivery Address</h2>
        </div>
        {selectedAddress && (
          <AddedAddress address={selectedAddress} hideActions />
        )}
      </div>

      {/* Payment Method */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Banknote className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold">Payment Method</h2>
        </div>
        <div className="text-lg font-medium capitalize">
          {checkout.selectedPaymentMethod}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingBag className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold">Order Summary</h2>
        </div>

        <div className="space-y-4 mb-6">
          {cart?.items?.map((item) => (
            <div
              key={`${item.product._id}-${item.selectedVariant}`}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="h-16 w-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">
                    Variant:{" "}
                    {
                      item.product.variant.variantTypes[item.selectedVariant]
                        .name
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ₹
                  {(
                    item.product.variant.variantTypes[item.selectedVariant]
                      .price * item.quantity
                  ).toFixed(2)}
                </p>
                {item.product.discount > 0 && (
                  <p className="text-sm text-green-600">
                    {item.product.discount}% off
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{totals.originalTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Total Discount</span>
            <span>
              -₹{(totals.originalTotal - totals.discountedTotal).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹{totals.discountedTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <ButtonPrimary
          onClick={handlePlaceOrder}
          disabled={
            !selectedAddress ||
            !checkout.selectedPaymentMethod ||
            orderProcessing
          }
          className="w-full sm:w-auto"
        >
          Place Order
        </ButtonPrimary>
      </div>
    </div>
  );
}
