import SearchBarAdmin from "@/components/Form/SearchBarAdmin";
import TableCreator from "@/components/Table/TableCreator";
import { productTableHead } from "@/constants/admin/products/productList";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAllProducts } from "@/redux/features/allProductsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import Pagination from "@/components/Pagination";

export default function ProductListPage() {
  const dispatch = useDispatch();
  const { products, loading, error, pagination } = useSelector(
    (state) => state.allProducts
  );

  useEffect(() => {
    fetchProducts(1);
  }, [dispatch]);

  const fetchProducts = (page) => {
    dispatch(fetchAllProducts({ page, limit: 10 }));
  };

  const handlePageChange = (newPage) => {
    fetchProducts(newPage);
  };

  const handleToggleListing = async (productId) => {
    try {
      await axios
        .patch(
          `${
            import.meta.env.VITE_USERS_API_BASE_URL
          }/api/products/toggle-listing`,
          { productId }
        )
        .then(() => {
          fetchProducts(pagination.currentPage);
        });
    } catch (error) {
      console.error("Error toggling listing:", error);
      toast.error("Unable to list product")
    }
  };

  const tableActions = (product) => (
    <div className="flex justify-center gap-2">
      <button
        className={`${
          product.isListed ? "bg-red-500" : "bg-green-500"
        } text-white px-3 py-1 rounded`}
        onClick={() => handleToggleListing(product._id)}
      >
        {product.isListed ? "Unlist" : "List"}
      </button>
    </div>
  );

  const formattedProducts = products.map((product) => ({
    _id: product._id,
    image: product.images[0] || "https://placehold.co/100x100?text=No+Image",
    name: product.name,
    category: product.category?.name || "N/A",
    price: `₹${product.price.toLocaleString()}`,
    creator: product.vendor?.name || "N/A",
    rating: product.rating.toFixed(1),
    isListed: product.isListed
  }));

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <SearchBarAdmin />
      <TableCreator
        tableHead={productTableHead}
        tableBody={formattedProducts}
        actionsRenderer={tableActions}
      />

      {!loading && pagination.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
