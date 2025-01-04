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
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const getVariantDetails = () => {
    if (!item?.productId) {
      return {
        originalPrice: 0,
        variantDetails: null
      };
    }

    // Calculate total price from all variants
    let totalVariantPrice = item.productId.price || 0;
    const variantDetails = item.variants ? Object.entries(item.variants).map(([variantName, typeName]) => {
      const variant = item.productId.variants?.find(
        v => v.variantName === variantName
      );
      const variantType = variant?.variantTypes?.find(
        t => t.name === typeName
      );

      if (variantType) {
        totalVariantPrice += variantType.price || 0;
      }

      return variant ? {
        name: variant.variantName,
        value: variantType?.name || 'Unknown',
        price: variantType?.price || 0
      } : null;
    }).filter(Boolean) : [];

    return {
      originalPrice: totalVariantPrice,
      variantDetails
    };
  };

  const getVariantImage = () => {
    if (!item?.productId) return null;

    if (item.variants && item.productId.variants?.length > 0) {
      for (const [variantName, typeName] of Object.entries(item.variants)) {
        const variant = item.productId.variants.find(v => v.variantName === variantName);
        const variantType = variant?.variantTypes.find(t => t.name === typeName);
        console.log("variant: ", variant);
        console.log("variantType: ", variantType);
        if (typeof variantType?.imageIndex === 'number') {
          return item.productId.images[variantType.imageIndex] || item.productId.images[0];
        }
      }
    }

    return item.productId.images[0];
  };

  const { originalPrice, variantDetails } = getVariantDetails();
  
  const singleItemDiscountedPrice = originalPrice * (1 - (item.productId?.discount || 0) / 100);
  const totalOriginalPrice = originalPrice * quantity;
  const totalDiscountedPrice = singleItemDiscountedPrice * quantity;

  const handleQuantityChange = async (type) => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const data = {
        productId: item.productId._id,
        ...(item.variants && { variants: item.variants })
      };

      const response = await (type === "increase"
        ? incrementCartItem(data)
        : decrementCartItem(data));

      if (response.success) {
        setQuantity((prev) => (type === "increase" ? prev + 1 : prev - 1));
        toast.success(response.message);
        dispatch(fetchUserCart());
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(`Error ${type === "increase" ? "increasing" : "decreasing"} quantity:`, error);
      toast.error(error.response.data.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const data = {
        productId: item.productId._id,
        ...(item.variants && { variants: item.variants })
      };

      const response = await removeFromCart(data);

      if (response.success) {
        toast.success(response.message);
        setIsRemoveModalOpen(false);
        dispatch(fetchUserCart());
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("An error occurred while removing the item");
    } finally {
      setIsLoading(false);
    }
  };

  if (!item.productId) return null;

  return (
    <>
      <div className={`flex gap-6 bg-white p-4 rounded-lg border ${
        isLoading ? 'opacity-60' : ''
      } border-gray-100 hover:border-gray-200 transition-all relative`}>
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}
        {/* Product Image */}
        <div
          className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
          onClick={() => navigate(`/home/product/${item.productId._id}`)}
        >
          <img
            src={getVariantImage()}
            alt={item.productId.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-medium text-lg hover:text-primary transition-colors">
                {item.productId.name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Avatar className="h-5 w-5">
                  <AvatarImage src={item.productId.vendor.profileImagePath} />
                  <AvatarFallback>{item.productId.vendor.name[0]}</AvatarFallback>
                </Avatar>
                <span>{item.productId.vendor.name}</span>
              </div>
              {variantDetails && (
                <div className="space-y-1">
                  {variantDetails.map((variant, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {variant.name}: {variant.value}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsRemoveModalOpen(true)}
              className="text-sm text-red-500 hover:text-red-600"
              disabled={isLoading}
            >
              Remove
            </button>
          </div>

          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">₹{totalDiscountedPrice.toFixed(2)}</span>
                {item.productId.discount > 0 && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{totalOriginalPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-green-600">
                      {item.productId.discount}% off
                    </span>
                  </>
                )}
              </div>
              {quantity > 1 && (
                <div className="text-sm text-gray-500">
                  ₹{singleItemDiscountedPrice.toFixed(2)} per item
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange("decrease")}
                disabled={quantity <= 1 || isLoading}
                className={`p-1 rounded ${
                  quantity <= 1 || isLoading
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange("increase")}
                disabled={quantity >= (item.productId?.stock || 5) || isLoading}
                className={`p-1 rounded ${
                  quantity >= (item.productId?.stock || 5) || isLoading
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isRemoveModalOpen}>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Remove Item</h3>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to remove this item from your cart?
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsRemoveModalOpen(false)}
              disabled={isLoading}
              className="rounded-md px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleRemove}
              disabled={isLoading}
              className="rounded-md px-3 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
