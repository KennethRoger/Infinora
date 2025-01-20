import { Card } from "@tremor/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { formatPrice } from "@/lib/utils";
import { FiTrendingUp, FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function BestSellingProducts({ dateRange }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProducts, setExpandedProducts] = useState({});

  const toggleProductExpansion = (productId) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${
            import.meta.env.VITE_USERS_API_BASE_URL
          }/api/metrics/vendor/best-selling-products`,
          {
            params: {
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error("Error fetching best selling products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellingProducts();
  }, [dateRange]);

  if (loading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <FiTrendingUp className="text-indigo-600 h-5 w-5" />
        <h2 className="text-lg font-semibold text-gray-800">
          Best Selling Products
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          No sales data available for this period
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={product._id} className="space-y-3">
              {/* Main Product Info */}
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 relative">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <span className="absolute -top-2 -left-2 h-6 w-6 flex items-center justify-center bg-indigo-600 text-white text-sm font-medium rounded-full">
                    {index + 1}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </h3>
                    {product.variants.length > 0 && (
                      <button
                        onClick={() => toggleProductExpansion(product._id)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        {expandedProducts[product._id] ? (
                          <FiChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <FiChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span>{product.totalQuantitySold} units sold</span>
                    <span>{formatPrice(product.totalRevenue)} revenue</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(product.basePrice)}
                    {product.discount > 0 && (
                      <span className="ml-1 text-green-600">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">base price</div>
                </div>
              </div>

              {expandedProducts[product._id] && product.variants.length > 0 && (
                <div className="ml-8 space-y-2">
                  {product.variants.map((variant, vIndex) => (
                    <div
                      key={vIndex}
                      className="flex items-center gap-3 p-2 rounded-md bg-gray-50"
                    >
                      <img
                        src={variant.image}
                        alt={variant.variantName}
                        className="h-8 w-8 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-700">
                          {variant.variantName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {variant.quantitySold} sold •{" "}
                          {formatPrice(variant.revenue)} revenue
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
