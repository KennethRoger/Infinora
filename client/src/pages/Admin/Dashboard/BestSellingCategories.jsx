import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@tremor/react";
import { formatPrice } from "@/lib/utils";
import { FiFolder, FiChevronRight } from "react-icons/fi";

export default function BestSellingCategories({ dateRange }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellingCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_USERS_API_BASE_URL}/api/metrics/admin/best-selling-categories`,
          {
            params: {
              startDate: dateRange.startDate,
              endDate: dateRange.endDate,
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching best selling categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellingCategories();
  }, [dateRange]);

  if (loading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
        <FiFolder className="text-indigo-600 h-5 w-5" />
        <h2 className="text-lg font-semibold text-gray-800">
          Best Selling Categories
        </h2>
      </div>

      {categories.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No data available</div>
      ) : (
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div
              key={category._id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600">
                  <span className="text-lg font-semibold">{index + 1}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {category.name}
                    {category.parentName && (
                      <span className="text-gray-500 text-sm">
                        <FiChevronRight className="inline mx-1" />
                        {category.parentName}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {category.totalQuantity} items sold • {category.totalOrders}{" "}
                    orders
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {formatPrice(category.totalRevenue)}
                </div>
                <div className="text-xs text-gray-500">total revenue</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
