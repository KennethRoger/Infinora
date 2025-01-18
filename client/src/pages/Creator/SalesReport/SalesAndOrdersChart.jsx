import { useState, useEffect } from "react";
import { getSalesAndOrdersMetrics } from "@/api/vendor/vendorMetrics";
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

export default function SalesAndOrdersChart() {
  const [timeRange, setTimeRange] = useState("7d");
  const [customRange, setCustomRange] = useState({ startDate: null, endDate: null });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getSalesAndOrdersMetrics(
        timeRange,
        timeRange === "custom" ? customRange.startDate : null,
        timeRange === "custom" ? customRange.endDate : null
      );
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch sales and orders metrics");
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
              {entry.name}: {entry.name === "Sales" 
                ? formatCurrency(entry.value)
                : entry.value}
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
        <h2 className="text-xl font-semibold">Sales & Orders Overview</h2>
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
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              stroke="#8884d8"
              tickFormatter={formatCurrency} 
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              stroke="#82ca9d" 
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="totalSales"
              stroke="#8884d8"
              name="Sales"
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="orderCount"
              stroke="#82ca9d"
              name="Orders"
              dot={false}
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
