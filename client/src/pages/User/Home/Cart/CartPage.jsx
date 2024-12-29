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

  const calculateItemTotal = (item) => {
    if (!item.productId) return 0;

    let basePrice = 0;

    if (item.selectedVariants?.length > 0) {
      basePrice = item.selectedVariants.reduce((total, selectedVariant) => {
        const variant = item.productId.productVariants.find(
          v => v.variantName === selectedVariant.variantName
        );
        const variantType = variant?.variantTypes.find(
          t => t.name === selectedVariant.typeName
        );
        return total + (variantType?.price || 0);
      }, 0);
    } else {
      basePrice = item.productId.price || 0;
    }

    const discountedPrice = basePrice * (1 - (item.productId.discount || 0) / 100);
    return discountedPrice * item.quantity;
  };

  const calculateTotals = () => {
    if (!cart?.items?.length) return { subtotal: 0, discount: 0, total: 0 };

    return cart.items.reduce((acc, item) => {
      if (!item.productId) return acc;

      let itemBasePrice = 0;

      if (item.selectedVariants?.length > 0) {
        itemBasePrice = item.selectedVariants.reduce((total, selectedVariant) => {
          const variant = item.productId.productVariants.find(
            v => v.variantName === selectedVariant.variantName
          );
          const variantType = variant?.variantTypes.find(
            t => t.name === selectedVariant.typeName
          );
          return total + (variantType?.price || 0);
        }, 0);
      } else {
        itemBasePrice = item.productId.price || 0;
      }

      const itemTotalBasePrice = itemBasePrice * item.quantity;
      const itemDiscount = itemTotalBasePrice * (item.productId.discount || 0) / 100;
      const itemFinalPrice = itemTotalBasePrice - itemDiscount;

      return {
        subtotal: acc.subtotal + itemTotalBasePrice,
        discount: acc.discount + itemDiscount,
        total: acc.total + itemFinalPrice
      };
    }, { subtotal: 0, discount: 0, total: 0 });
  };

  const { subtotal, discount, total } = calculateTotals();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
            <Button className="w-full mt-6" onClick={() => navigate("/home/checkout")}>Proceed to Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
