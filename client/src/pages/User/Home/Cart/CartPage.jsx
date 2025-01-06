import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserCart } from "@/redux/features/userCartSlice";
import CartCard from "@/components/Cart/CartCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading, error } = useSelector((state) => state.userCart);

  useEffect(() => {
    dispatch(fetchUserCart());
  }, [dispatch]);

  const checkStock = (item) => {
    if (!item?.productId) return false;

    if (item.variants && item.productId.variants?.length > 0) {
      const matchingCombination = item.productId.variantCombinations?.find((combo) => {
        return Object.entries(item.variants).every(
          ([key, value]) => combo.variants[key] === value
        );
      });
      return matchingCombination && matchingCombination.stock >= item.quantity;
    }

    return item.productId.stock >= item.quantity;
  };

  const calculateTotals = () => {
    if (!cart?.items?.length) return { subtotal: 0, discount: 0, total: 0 };

    return cart.items.reduce((acc, item) => {
      if (!item?.productId) return acc;

      let itemBasePrice = item.productId.price || 0;
      
      // Add variant prices
      if (item.variants) {
        const matchingCombination = item.productId.variantCombinations?.find((combo) => {
          return Object.entries(item.variants).every(
            ([key, value]) => combo.variants[key] === value
          );
        });
        if (matchingCombination) {
          itemBasePrice += matchingCombination.priceAdjustment || 0;
        }
      }

      const itemTotalBasePrice = itemBasePrice * (item.quantity || 1);
      const itemDiscount = (itemTotalBasePrice * (item.productId.discount || 0)) / 100;

      return {
        subtotal: acc.subtotal + itemTotalBasePrice,
        discount: acc.discount + itemDiscount,
        total: acc.total + (itemTotalBasePrice - itemDiscount)
      };
    }, { subtotal: 0, discount: 0, total: 0 });
  };

  const { subtotal, discount, total } = calculateTotals();

  if (loading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="h-40 bg-gray-200 rounded animate-pulse"></div>
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
              <CartCard key={index} item={item} />
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
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
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
