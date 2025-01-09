import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getAdminSalesReport } from "@/api/admin/adminMetrics";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const REPORT_TYPES = [
  { label: "Today", value: "1d" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "This Month", value: "month" },
  { label: "This Year", value: "year" },
];

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  shipped: "bg-blue-100 text-blue-800",
};

export default function AdminSalesReport() {
  const [salesData, setSalesData] = useState({
    orders: [],
    summary: {
      totalOrders: 0,
      totalRevenue: 0,
      totalCommission: 0,
      topVendors: [],
    },
  });

  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      startDate: new Date(new Date().setHours(0, 0, 0, 0)),
      endDate: new Date(),
      reportType: "1d",
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const reportType = watch("reportType");

  const fetchReport = async (data) => {
    try {
      setLoading(true);
      const response = await getAdminSalesReport(
        data.startDate,
        data.endDate,
        data.reportType,
        selectedVendor
      );
      setSalesData(response);
    } catch (error) {
      toast.error("Failed to fetch sales report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport({ startDate, endDate, reportType });
  }, [reportType, selectedVendor]);

  const handleReportTypeChange = (type) => {
    const today = new Date();
    setValue("reportType", type);

    switch (type) {
      case "1d":
        setValue("startDate", today);
        setValue("endDate", today);
        break;
      case "7d":
        setValue("startDate", new Date(today.setDate(today.getDate() - 7)));
        setValue("endDate", new Date());
        break;
      case "30d":
        setValue("startDate", new Date(today.setDate(today.getDate() - 30)));
        setValue("endDate", new Date());
        break;
      case "month":
        setValue(
          "startDate",
          new Date(today.getFullYear(), today.getMonth(), 1)
        );
        setValue(
          "endDate",
          new Date(today.getFullYear(), today.getMonth() + 1, 0)
        );
        break;
      case "year":
        setValue("startDate", new Date(today.getFullYear(), 0, 1));
        setValue("endDate", new Date(today.getFullYear(), 11, 31));
        break;
    }
  };

  const formatCurrency = (amount) => {
    const value = Number(amount || 0);
    return `₹${value.toLocaleString()}`;
  };

  const calculateTotalDiscount = (order) => {
    const totalAmount = Number(order.totalAmount || 0);
    const finalAmount = Number(order.finalAmount || 0);
    return totalAmount - finalAmount;
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Platform Sales Report", 14, 22);

    doc.setFontSize(12);
    doc.text(
      `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`,
      14,
      32
    );

    doc.setFontSize(14);
    doc.text("Platform Summary", 14, 45);
    const summaryData = [
      ["Total Orders", salesData.summary.totalOrders],
      ["Total Revenue", formatCurrency(salesData.summary.totalRevenue)],
      ["Total Commission", formatCurrency(salesData.summary.totalCommission)],
    ];

    doc.autoTable({
      startY: 50,
      head: [["Metric", "Value"]],
      body: summaryData,
      theme: "grid",
    });

    doc.setFontSize(14);
    doc.text("Top Performing Vendors", 14, doc.autoTable.previous.finalY + 20);
    const vendorData = salesData.summary.topVendors.map((vendor) => [
      vendor.name,
      vendor.email,
      formatCurrency(vendor.revenue),
      vendor.orderCount,
    ]);

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 25,
      head: [["Vendor", "Email", "Revenue", "Orders"]],
      body: vendorData,
      theme: "grid",
    });

    doc.setFontSize(14);
    doc.text("Order Details", 14, doc.autoTable.previous.finalY + 20);

    const orderData = salesData.orders.map((order) => [
      order.orderId,
      order.vendorName,
      format(new Date(order.createdAt), "MMM d, yyyy"),
      formatCurrency(order.totalAmount),
      formatCurrency(calculateTotalDiscount(order)),
      order.appliedCoupon?.couponCode || "-",
      formatCurrency(order.commission),
      (order.status || "pending").toUpperCase(),
    ]);

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 25,
      head: [
        [
          "Order ID",
          "Vendor",
          "Date",
          "Amount",
          "Discount",
          "Coupon",
          "Commission",
          "Status",
        ],
      ],
      body: orderData,
      theme: "grid",
    });

    doc.save("platform-sales-report.pdf");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Platform Sales Report</h2>
        <Button onClick={generatePDF}>Download PDF</Button>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            {REPORT_TYPES.map((type) => (
              <Button
                key={type.value}
                variant={reportType === type.value ? "default" : "outline"}
                onClick={() => handleReportTypeChange(type.value)}
              >
                {type.label}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold">
                {salesData.summary.totalOrders || 0}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Platform Revenue</p>
              <p className="text-2xl font-semibold text-green-600">
                {formatCurrency(salesData.summary.totalRevenue)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Commission Earned</p>
              <p className="text-2xl font-semibold text-blue-600">
                {formatCurrency(salesData.summary.totalCommission)}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">
              Top Performing Vendors
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {salesData.summary.topVendors.map((vendor, index) => (
                <Card key={index} className="p-4">
                  <div className="font-medium">{vendor.name}</div>
                  <div className="text-sm text-gray-500">{vendor.email}</div>
                  <div className="mt-2">
                    <div className="text-green-600">
                      Revenue: {formatCurrency(vendor.revenue)}
                    </div>
                    <div className="text-gray-600">
                      Orders: {vendor.orderCount}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Final Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salesData.orders.map((order) => (
                  <tr key={order.orderId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="font-medium">{order.vendorName}</div>
                      <div className="text-sm text-gray-500">
                        {order.vendorEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(order.finalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {formatCurrency(order.commission)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          STATUS_COLORS[order.status] || STATUS_COLORS.pending
                        }`}
                      >
                        {order.status || "pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
