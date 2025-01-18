import { useState, useEffect } from "react";
import { getUserActivityMetrics } from "@/api/admin/adminMetrics";
import TimeRangeSelector from "@/components/TimeRange/TimeRangeSelector";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import toast from "react-hot-toast";

const COLORS = {
  users: ["#0088FE", "#00C49F", "#FFBB28"],
  orders: ["#FF8042", "#A4DE6C", "#FF6B6B", "#4ECDC4"]
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function UserActivityChart() {
  const [timeRange, setTimeRange] = useState("7d");
  const [customRange, setCustomRange] = useState({ startDate: null, endDate: null });
  const [data, setData] = useState({ users: [], orders: [] });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getUserActivityMetrics(
        timeRange,
        timeRange === "custom" ? customRange.startDate : null,
        timeRange === "custom" ? customRange.endDate : null
      );
      if (response.success) {
        // Format user roles
        const userMetrics = response.data.users.map(item => ({
          name: item.role.charAt(0).toUpperCase() + item.role.slice(1),
          value: item.count
        }));

        // Format order statuses
        const orderMetrics = response.data.orders.map(item => ({
          name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          value: item.count
        }));

        setData({
          users: userMetrics,
          orders: orderMetrics
        });
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch user activity metrics");
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

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p style={{ color: payload[0].color }}>
            Count: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">User Activity</h2>
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
      ) : data.users.length > 0 ? (
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium mb-4">User Distribution</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={data.users}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.users.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.users[index % COLORS.users.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium mb-4">Order Status Distribution</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={data.orders}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.orders.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.orders[index % COLORS.orders.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="h-[400px] flex items-center justify-center text-gray-500">
          No data available for the selected time range
        </div>
      )}
    </div>
  );
}
