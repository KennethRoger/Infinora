import { useState, useEffect } from "react";
import { Card } from "@tremor/react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { getFinancialAnalytics } from "@/api/vendor/vendorMetrics";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function FinancialAnalytics() {
  const [metrics, setMetrics] = useState({
    revenueAfterCommission: 0,
    paymentMethods: [],
    refundStats: {
      totalRefunds: 0,
      refundRate: 0,
      refundAmount: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  const { register, watch } = useForm({
    defaultValues: {
      timeRange: "7d",
    },
  });

  const timeRange = watch("timeRange");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await getFinancialAnalytics(timeRange);
        setMetrics(data);
      } catch (error) {
        console.error("Failed to fetch financial analytics:", error);
        toast.error(error.message || "Failed to fetch financial data");
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 rounded"></div>
            <div className="h-80 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Financial Analytics</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue After Commission */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-6">Revenue Breakdown</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold">
                ₹{metrics.totalRevenue?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Commission</p>
              <p className="text-2xl font-semibold text-red-500">
                -₹
                {(
                  metrics.totalRevenue - metrics.revenueAfterCommission
                )?.toLocaleString()}
              </p>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">Revenue After Commission</p>
              <p className="text-2xl font-semibold text-green-600">
                ₹{metrics.revenueAfterCommission?.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Payment Method Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.paymentMethods}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {metrics.paymentMethods.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} orders`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Refund Statistics */}
        <Card className="p-6 md:col-span-2">
          <h3 className="text-lg font-medium mb-6">Refund Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Total Refunds</p>
              <p className="text-2xl font-semibold">
                {metrics.refundStats.totalRefunds}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Refund Rate</p>
              <p className="text-2xl font-semibold">
                {(metrics.refundStats.refundRate * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Refund Amount</p>
              <p className="text-2xl font-semibold text-red-500">
                ₹{metrics.refundStats.refundAmount?.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
