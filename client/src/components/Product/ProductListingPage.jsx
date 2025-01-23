import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductListingSidebar from "./ProductListingSidebar";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import { searchProducts } from "@/redux/features/searchSlice";

export default function ProductListingPage() {
  const location = useLocation();
  const {
    products: initialProducts,
    type,
    title: initialTitle,
  } = location.state || {};
  const [products, setProducts] = useState(initialProducts || []);
  const [title, setTitle] = useState(initialTitle || "All Products");

  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    categories: [],
    rating: 0,
    availability: "all",
  });
  const [sortBy, setSortBy] = useState("default");

  const dispatch = useDispatch();
  const {
    results: searchResults,
    searchTerm,
    pagination,
  } = useSelector((state) => state.search);

  useEffect(() => {
    if (location.state?.products) {
      setProducts(location.state.products);
      setTitle(location.state.title || "All Products");
    } else if (Array.isArray(searchResults)) {
      console.log("product set to searchResults");
      setProducts(searchResults);
      if (searchTerm) {
        setTitle(`Search Results for "${searchTerm}"`);
      } else {
        setTitle("All Products");
      }
    }
  }, [location.state, searchResults, searchTerm]);

  const getFilteredProducts = () => {
    if (!Array.isArray(products)) {
      console.log(products);
      return [];
    }

    return products
      .filter((product) => {
        const price = product.price * (1 - (product.discount || 0) / 100);

        if (price < filters.priceRange[0] || price > filters.priceRange[1])
          return false;

        if (
          filters.categories.length > 0 &&
          !filters.categories.includes(product.category?.name)
        ) {
          return false;
        }

        if (filters.rating > 0 && (product.rating || 0) < filters.rating)
          return false;

        if (filters.availability !== "all") {
          const inStock = (product.stockQuantity || 0) > 0;
          if (filters.availability === "in-stock" && !inStock) return false;
          if (filters.availability === "out-of-stock" && inStock) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return (
              a.price * (1 - (a.discount || 0) / 100) -
              b.price * (1 - (b.discount || 0) / 100)
            );
          case "price-high":
            return (
              b.price * (1 - (b.discount || 0) / 100) -
              a.price * (1 - (a.discount || 0) / 100)
            );
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          default:
            return 0;
        }
      });
  };

  const filteredProducts = getFilteredProducts();
  console.log("Filtered products:", filteredProducts);

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      categories: [],
      rating: 0,
      availability: "all",
    });
    setSortBy("default");
  };

  const handlePageChange = (newPage) => {
    if (searchTerm) {
      dispatch(searchProducts({ searchTerm, page: newPage, limit: 20 }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6 min-h-screen">
        <div className="w-64 flex-shrink-0 sticky top-[80px] h-fit max-h-[calc(100vh-120px)] overflow-y-auto">
          <ProductListingSidebar
            filters={filters}
            setFilters={setFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>

        <div className="flex-grow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="text-gray-600">
              Showing {filteredProducts.length} result
              {filteredProducts.length === 1 ? "" : "s"}
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-4xl mb-4">😕</p>
              <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters to find what you're looking for
              </p>
              <Button onClick={resetFilters}>Clear All Filters</Button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8">
        {pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
