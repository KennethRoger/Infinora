import SearchBarAdmin from "@/components/Form/SearchBarAdmin";
import TableCreator from "@/components/Table/TableCreator";
import { productTableHead } from "@/constants/admin/products/productList";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAllProducts } from "@/redux/features/allProductsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function ProductListPage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.allProducts
  );

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleUnlist = async (productId) => {
    try {
      await axios.patch(
        `${
          import.meta.env.VITE_USERS_API_BASE_URL
        }/api/products/${productId}/toggle-listing`,
        {},
        { withCredentials: true }
      );
      toast.success("Product listing status updated");
      dispatch(fetchAllProducts()); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };

  const tableActions = (product) => (
    <div className="flex justify-center gap-2">
      <button
        className={`${
          product.isListed ? "bg-red-500" : "bg-green-500"
        } text-white px-3 py-1 rounded`}
        onClick={() => handleUnlist(product._id)}
      >
        {product.isListed ? "Unlist" : "List"}
      </button>
    </div>
  );

  const formattedProducts = products.map((product) => ({
    image: product.images[0] || "https://placehold.co/100x100?text=No+Image",
    name: product.name,
    category: product.category?.name || "N/A",
    price: `₹${product.price.toLocaleString()}`,
    creator: product.vendor?.name || "N/A",
    rating: product.rating.toFixed(1),
    isListed: product.isListed,
    _id: product._id,
  }));

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <SearchBarAdmin />
      <TableCreator
        tableHead={productTableHead}
        tableBody={formattedProducts}
        actionsRenderer={tableActions}
      />
    </div>
  );
}
