import { useState, useEffect } from "react";
import { getAdminRevenueMetrics } from "@/api/admin/adminMetrics";
import TimeRangeSelector from "@/components/TimeRange/TimeRangeSelector";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";

export default function RevenueOverviewChart() {
  const [timeRange, setTimeRange] = useState("7d");
  const [customRange, setCustomRange] = useState({ startDate: null, endDate: null });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAdminRevenueMetrics(
        timeRange,
        timeRange === "custom" ? customRange.startDate : null,
        timeRange === "custom" ? customRange.endDate : null
      );
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch revenue metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange, customRange]);

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };

  const handleCustomRangeChange = (range) => {
    setCustomRange(range);
    if (range.startDate && range.endDate) {
      fetchData();
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Revenue Overview</h2>
        <TimeRangeSelector
          value={timeRange}
          onChange={handleTimeRangeChange}
          onCustomRange={handleCustomRangeChange}
        />
      </div>

      {loading ? (
        <div className="h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalRevenue"
              stroke="#8884d8"
              name="Total Revenue"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="platformFees"
              stroke="#82ca9d"
              name="Platform Fees"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="vendorEarnings"
              stroke="#ffc658"
              name="Vendor Earnings"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[400px] flex items-center justify-center text-gray-500">
          No data available for the selected time range
        </div>
      )}
    </div>
  );
}
