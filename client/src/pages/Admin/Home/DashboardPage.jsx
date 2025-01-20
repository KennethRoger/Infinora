import AdminSalesReport from "./SalesReport/AdminSalesReport";
import RevenueOverviewChart from "../Dashboard/RevenueOverviewChart";
import UserActivityChart from "../Dashboard/UserActivityChart";
import BestSellingCategories from "../Dashboard/BestSellingCategories";
import { useState } from "react";
import { subDays } from "date-fns";

export default function DashboardPage() {
  const [selectedRange] = useState("7d");
  
  const getDateRange = (range) => {
    const endDate = new Date();
    let startDate;

    switch (range) {
      case "30d":
        startDate = subDays(endDate, 30);
        break;
      case "1y":
        startDate = subDays(endDate, 365);
        break;
      case "7d":
      default:
        startDate = subDays(endDate, 7);
    }

    return { startDate, endDate };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="space-y-8">
          <RevenueOverviewChart />
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BestSellingCategories dateRange={getDateRange(selectedRange)} />
        </div> */}

        <UserActivityChart />
        
        <AdminSalesReport />
      </div>
    </div>
  );
}
