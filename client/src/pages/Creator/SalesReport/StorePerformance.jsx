import { useState, useEffect } from "react";
import { Card } from "@tremor/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { getStorePerformance } from "@/api/vendor/vendorMetrics";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

export default function StorePerformance() {
  const [metrics, setMetrics] = useState({
    revenue: [],
    orderCount: 0,
    avgOrderValue: 0,
    bestSellers: [],
  });
  const [loading, setLoading] = useState(true);

  const { register, watch } = useForm({
    defaultValues: {
      timeRange: "7d"
    }
  });

  const timeRange = watch("timeRange");
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await getStorePerformance(timeRange);
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
        toast.error(error.message || "Failed to fetch store metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-80 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Store Performance</h2>
        <select
          {...register("timeRange")}
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Revenue Chart */}
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4">Revenue Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.revenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), "MMM d")}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => [`₹${value}`, "Revenue"]}
                labelFormatter={(date) => format(new Date(date), "MMM d, yyyy")}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#6366f1"
                fill="#818cf8"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-2xl font-semibold mt-2">{metrics.orderCount}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">
            Average Order Value
          </h3>
          <p className="text-2xl font-semibold mt-2">
            ₹{metrics.avgOrderValue}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-semibold mt-2">
            ₹{metrics.revenue.reduce((sum, item) => sum + item.amount, 0)}
          </p>
        </Card>
      </div>

      {/* Best Sellers */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Best Selling Products</h3>
        <div className="space-y-4">
          {metrics.bestSellers.map((product) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="ml-4">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">
                    {product.soldCount} sold
                  </p>
                </div>
              </div>
              <p className="font-medium">₹{product.revenue}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
