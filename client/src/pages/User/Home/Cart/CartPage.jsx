import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserCart } from "@/redux/features/userCartSlice";
import CartCard from "@/components/Cart/CartCard";
import Spinner from "@/components/Spinner/Spinner";

export default function CartPage() {
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.userCart || {});

  useEffect(() => {
    dispatch(fetchUserCart());
  }, [dispatch]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!cart?.items?.length) {
    return <div className="text-center py-8">Your cart is empty</div>;
  }

  const totals = cart.items.reduce(
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
  );

  const totalDiscount = totals.originalTotal - totals.discountedTotal;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 pt-[75px]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <h1 className="text-2xl font-semibold">Shopping Cart</h1>

          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <CartCard key={item._id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Items Total</span>
                <span>₹{totals.originalTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Shop Discount</span>
                <span>-₹{totalDiscount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>₹{totals.discountedTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-primary text-white py-2 rounded-lg mt-4">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
