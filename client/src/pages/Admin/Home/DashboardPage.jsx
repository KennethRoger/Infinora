import AdminSalesReport from "./SalesReport/AdminSalesReport";
import RevenueOverviewChart from "../Dashboard/RevenueOverviewChart";
import UserActivityChart from "../Dashboard/UserActivityChart";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="space-y-8">
        {/* Revenue Overview Chart */}
        <RevenueOverviewChart />

        {/* User Activity Chart */}
        <UserActivityChart />
        
        <AdminSalesReport />
      </div>
    </div>
  );
}
