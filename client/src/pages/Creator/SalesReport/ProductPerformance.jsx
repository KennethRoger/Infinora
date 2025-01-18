import { useState, useEffect } from "react";
import { getProductPerformance } from "@/api/vendor/vendorMetrics";
import TimeRangeSelector from "@/components/TimeRange/TimeRangeSelector";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";

export default function ProductPerformance() {
  const [timeRange, setTimeRange] = useState("7d");
  const [customRange, setCustomRange] = useState({ startDate: null, endDate: null });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getProductPerformance(
        timeRange,
        timeRange === 'custom' ? customRange.startDate : null,
        timeRange === 'custom' ? customRange.endDate : null
      );
      if (response.success) {
        const formattedData = response.data.map(item => ({
          name: item.name,
          Revenue: item.totalRevenue,
          "Units Sold": item.totalQuantity,
          image: item.image
        }));
        setData(formattedData);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch product performance");
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
          <img 
            src={data.find(item => item.name === label)?.image} 
            alt={label}
            className="w-20 h-20 object-cover mb-2 rounded"
          />
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name === "Revenue" 
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
        <h2 className="text-xl font-semibold">Top Performing Products</h2>
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
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar yAxisId="left" dataKey="Revenue" fill="#8884d8" />
            <Bar yAxisId="right" dataKey="Units Sold" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[400px] flex items-center justify-center text-gray-500">
          No data available for the selected time range
        </div>
      )}
    </div>
  );
}
