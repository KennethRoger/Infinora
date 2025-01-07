import { useDispatch } from "react-redux";
import StarRating from "../Rating/StarRating";
import { useNavigate } from "react-router-dom";
import { fetchProductById } from "@/redux/features/singleProductSlice";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleProductClick = async () => {
    try {
      await dispatch(fetchProductById(product._id));
      navigate(`/home/product/${product._id}`);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const calculateInitialPrice = () => {
    if (product.variants?.length > 0 && product.variantCombinations?.length > 0) {
      const minPriceAdjustment = Math.min(
        ...product.variantCombinations.map((combo) => combo.priceAdjustment || 0)
      );
      return product.price + minPriceAdjustment;
    }
    return product.price;
  };

  const initialPrice = calculateInitialPrice();
  const discountedPrice = initialPrice * (1 - product.discount / 100);

  return (
    <div
      className="w-[300px] h-[400px] border shadow-lg overflow-hidden cursor-pointer flex flex-col"
      onClick={handleProductClick}
    >
      <div className="h-[250px] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-between flex-grow p-4">
        <div>
          <p className="text-gray-600 text-sm truncate">
            {product.vendor.name}
          </p>
          <h3 className="font-bold text-base truncate">{product.name}</h3>
          <StarRating rating={product.rating} />
        </div>
        <div className="flex items-center gap-2">
          <p className="font-bold text-xl text-black">
            ₹{discountedPrice.toFixed(2)}
          </p>
          {product.discount > 0 && (
            <div className="flex gap-2 text-sm">
              <s className="text-gray-600">₹{initialPrice.toFixed(2)}</s>
              <p className="text-green-600">{product.discount}% off</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
