import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggleProductFavorite } from "@/redux/features/userFavoriteSlice";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

export default function FavoriteCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!product) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-pulse">
        <div className="h-48 bg-gray-200" />
        <div className="p-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  // Get stock based on whether product has variants or not
  const stock = product.variantCombinations?.length > 0 
    ? product.variantCombinations[0].stock 
    : product.stock;

  const handleRemoveFavorite = async () => {
    await dispatch(toggleProductFavorite(product._id));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative group">
        <div className="w-full h-48 bg-gray-100">
          <img
            src={product.images?.[0] || "/product-placeholder.png"}
            alt={product.name || "Product"}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => navigate(`/home/product/${product._id}`)}
          />
        </div>
        
        {/* Overlay with remove favorite action */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleRemoveFavorite}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            <Heart className="h-6 w-6 fill-red-500 text-red-500" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 
          className="text-lg font-semibold mb-2 cursor-pointer hover:text-orange-500"
          onClick={() => navigate(`/home/product/${product._id}`)}
        >
          {product.name}
        </h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">₹{product.price?.toLocaleString()}</p>
            {product.discount > 0 && (
              <p className="text-sm text-green-600">
                {product.discount}% off
              </p>
            )}
          </div>
          <p className={`text-sm ${stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {stock > 0 ? `${stock} in stock` : 'Out of stock'}
          </p>
        </div>
      </div>
    </div>
  );
}