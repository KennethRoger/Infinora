import AdminSalesReport from "./SalesReport/AdminSalesReport";

export default function DashboardPage() {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-8">Platform Overview</h1>
      <AdminSalesReport />
    </div>
  );
}
