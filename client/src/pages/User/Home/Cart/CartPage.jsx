import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserCart } from "@/redux/features/userCartSlice";
import CartCard from "@/components/Cart/CartCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getAppliedCoupons } from "@/utils/couponStorage";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading, error } = useSelector((state) => state.userCart);
  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    couponDiscount: 0,
    total: 0,
  });
  const [couponUpdate, setCouponUpdate] = useState(0);

  useEffect(() => {
    dispatch(fetchUserCart());
  }, [dispatch]);

  useEffect(() => {
    setTotals(calculateTotals());
  }, [cart, couponUpdate]);

  const handleCouponChange = () => {
    setCouponUpdate(prev => prev + 1);
  };

  const checkStock = (item) => {
    if (!item?.productId) return false;

    if (item.variants && item.productId.variants?.length > 0) {
      const matchingCombination = item.productId.variantCombinations?.find(
        (combo) => {
          return Object.entries(item.variants).every(
            ([key, value]) => combo.variants[key] === value
          );
        }
      );
      return matchingCombination && matchingCombination.stock >= item.quantity;
    }

    return item.productId.stock >= item.quantity;
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let discount = 0;
    let couponDiscount = 0;

    cart?.items?.forEach((item) => {
      if (!item?.productId) return;

      let basePrice = item.productId.price || 0;

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

      const quantity = item.quantity;
      const itemDiscount = (basePrice * (item.productId?.discount || 0)) / 100;

      subtotal += basePrice * quantity;
      discount += itemDiscount * quantity;

      const appliedCoupon = getAppliedCoupons().find(
        (coupon) => coupon.productId === item.productId._id
      );
      if (appliedCoupon) {
        couponDiscount += appliedCoupon.couponDiscount;
      }
    });

    return {
      subtotal,
      discount,
      couponDiscount,
      total: subtotal - discount - couponDiscount,
    };
  };

  const { subtotal, discount, couponDiscount, total } = calculateTotals();

  if (loading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div
                  key={index}
                  className="h-40 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => dispatch(fetchUserCart())}>Try Again</Button>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-4">
        <p className="text-gray-500">Your cart is empty</p>
        <Button onClick={() => navigate("/home")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-2xl font-semibold">Shopping Cart</h1>
          <div className="space-y-4">
            {cart.items.map((item, index) => (
              <CartCard key={index} item={item} onCouponChange={handleCouponChange} />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Product Discount</span>
                <span>-₹{totals.discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Coupon Discount</span>
                <span>-₹{totals.couponDiscount.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Button
              className="w-full mt-6"
              onClick={() => navigate("/home/checkout/delivery")}
              disabled={!cart?.items?.every(checkStock)}
            >
              {!cart?.items?.every(checkStock)
                ? "Some items are out of stock"
                : "Proceed to Checkout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
