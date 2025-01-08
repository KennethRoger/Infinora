import { useDispatch, useSelector } from "react-redux";
import StarRating from "../Rating/StarRating";
import { useNavigate } from "react-router-dom";
import { fetchProductById } from "@/redux/features/singleProductSlice";
import { Heart } from "lucide-react";
import {
  fetchUserFavorites,
  toggleProductFavorite,
} from "@/redux/features/userFavoriteSlice";
import { useEffect } from "react";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: favorites, loading: favoritesLoading } = useSelector(
    (state) => state.favorites
  );

  useEffect(() => {
    dispatch(fetchUserFavorites());
  }, [dispatch]);

  const handleProductClick = async () => {
    try {
      await dispatch(fetchProductById(product._id));
      navigate(`/home/product/${product._id}`);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };
  const isFavorited = favorites.some(
    (favorite) => favorite.productId._id === product?._id
  );

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    dispatch(toggleProductFavorite(product._id));
  };

  const calculateInitialPrice = () => {
    if (
      product.variants?.length > 0 &&
      product.variantCombinations?.length > 0
    ) {
      const minPriceAdjustment = Math.min(
        ...product.variantCombinations.map(
          (combo) => combo.priceAdjustment || 0
        )
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
      <div className="h-[250px] overflow-hidden relative">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={handleFavoriteClick}
          disabled={favoritesLoading}
          className="p-2 hover:bg-gray-100 absolute top-3 right-3 rounded-full bg-gray-50"
        >
          <Heart
            className={`h-6 w-6 ${
              isFavorited ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </button>
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
