import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  incrementCartItem,
  decrementCartItem,
  removeFromCart,
} from "@/api/cart/cartApi";
import { useDispatch } from "react-redux";
import { fetchUserCart } from "@/redux/features/userCartSlice";
import toast from "react-hot-toast";
import Modal from "@/components/Modal/Modal";
import { useNavigate } from "react-router-dom";

export default function CartCard({ item }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const dispatch = useDispatch();

  const originalPrice =
    item.product.variant.variantTypes[item.selectedVariant].price;
  const discountedPrice = originalPrice * (1 - item.product.discount / 100);

  const handleQuantityChange = async (type) => {
    console.log(item);
    try {
      const data = {
        productId: item.product._id,
        selectedVariant: item.selectedVariant,
      };

      const response = await (type === "increase"
        ? incrementCartItem(data)
        : decrementCartItem(data));

      if (response.success) {
        setQuantity((prev) => (type === "increase" ? prev + 1 : prev - 1));
        toast.success(
          type === "increase" ? "Quantity increased" : "Quantity decreased"
        );
        dispatch(fetchUserCart());
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("An error occurred while updating quantity");
    }
  };

  const handleRemove = async () => {
    try {
      const data = {
        productId: item.product._id,
        selectedVariant: item.selectedVariant,
      };

      const response = await removeFromCart(data);

      if (response.success) {
        toast.success("Item removed from cart");
        setIsRemoveModalOpen(false);
        dispatch(fetchUserCart());
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("An error occurred while removing the item");
    }
  };

  return (
    <>
      <div className="flex gap-6 bg-white p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-all">
        {/* Product Image */}
        <div
          className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
          onClick={() => navigate(`/home/product/${item.product._id}`)}
        >
          <img
            src={item.product.images[item.selectedVariant] || item.product.images[0]}
            alt={item.product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-medium text-lg hover:text-primary transition-colors">
                {item.product.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={item.product.vendor.profileImagePath} />
                  <AvatarFallback>{item.product.vendor.name[0]}</AvatarFallback>
                </Avatar>
                <span>{item.product.vendor.name}</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="text-right space-y-1">
              <div className="font-semibold text-lg text-primary">
                ₹{(discountedPrice * quantity).toFixed(2)}
              </div>
              {item.product.discount > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 line-through">
                    ₹{(originalPrice * quantity).toFixed(2)}
                  </span>
                  <span className="text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                    {item.product.discount}% off
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Variant and Controls */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                {`${item.product.variant.variantName}: `}
                <span className="font-medium">
                  {item.product.variant.variantTypes[item.selectedVariant].name}
                </span>
              </div>
              <button
                className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1 hover:underline"
                onClick={() => setIsRemoveModalOpen(true)}
              >
                Remove
              </button>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-lg bg-gray-50">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("increase")}
                  className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                  disabled={quantity >= 5}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {quantity >= 5 && (
                <span className="text-sm text-red-500">Max limit</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isRemoveModalOpen}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Remove Item</h3>
          <p className="text-gray-600">
            Are you sure you want to remove "{item.product.name}" from your
            cart?
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              onClick={() => setIsRemoveModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
              onClick={handleRemove}
            >
              Remove
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
