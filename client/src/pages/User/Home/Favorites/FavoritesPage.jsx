import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserFavorites } from "@/redux/features/userFavoriteSlice";
import FavoriteCard from "@/components/Favorites/FavoriteCard";


export default function FavoritesPage() {
  const dispatch = useDispatch();
  const { items: favorites, loading } = useSelector((state) => state.favorites);

  useEffect(() => {
    dispatch(fetchUserFavorites());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-75px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!favorites.length) {
    return (
      <div className="min-h-[calc(100vh-75px)] flex flex-col items-center justify-center gap-4">
        <img
          src="/empty-favorites.png"
          alt="No favorites"
          className="w-64 opacity-50"
        />
        <h2 className="text-2xl font-semibold text-gray-600">
          No favorites yet
        </h2>
        <p className="text-gray-500">
          Start adding products to your favorites!
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((favorite) => (
          <FavoriteCard
            key={favorite.productId._id}
            product={favorite.productId}
          />
        ))}
      </div>
    </div>
  );
}