import { useState, useEffect } from "react";
import { Card } from "@tremor/react";
import { getSalesReport } from "@/api/vendor/vendorMetrics";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Pagination from "@/components/Pagination";
import BestSellingProducts from "./BestSellingProducts";

const REPORT_TYPES = [
  { label: "Custom Range", value: "custom" },
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

const ITEMS_PER_PAGE = 10;

export default function SalesReport() {
  const [salesData, setSalesData] = useState({
    orders: [],
    summary: {
      totalOrders: 0,
      totalAmount: 0,
      totalDiscount: 0,
      couponDiscount: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const { register, control, watch, setValue } = useForm({
    defaultValues: {
      reportType: "7d",
      startDate: subDays(new Date(), 7),
      endDate: new Date(),
    },
  });

  const reportType = watch("reportType");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const totalPages = Math.ceil(salesData.orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = salesData.orders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        setLoading(true);
        const data = await getSalesReport({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          reportType,
        });
        setSalesData(data);
        console.log(salesData);
      } catch (error) {
        console.error("Failed to fetch sales report:", error);
        toast.error(error.message || "Failed to fetch sales report");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesReport();
  }, [reportType, startDate, endDate]);

  const handleReportTypeChange = (e) => {
    const type = e.target.value;
    setValue("reportType", type);

    const today = new Date();
    switch (type) {
      case "1d":
        setValue("startDate", startOfDay(today));
        setValue("endDate", endOfDay(today));
        break;
      case "7d":
        setValue("startDate", subDays(today, 7));
        setValue("endDate", today);
        break;
      case "30d":
        setValue("startDate", subDays(today, 30));
        setValue("endDate", today);
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
    doc.text("Sales Report", 14, 22);

    doc.setFontSize(12);
    doc.text(
      `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`,
      14,
      32
    );

    doc.setFontSize(14);
    doc.text("Summary", 14, 45);
    const summaryData = [
      ["Total Orders", salesData.summary.totalOrders],
      ["Total Amount", `₹${salesData.summary.totalAmount.toLocaleString()}`],
      [
        "Total Discount",
        `₹${salesData.summary.totalDiscount.toLocaleString()}`,
      ],
      [
        "Coupon Discount",
        `₹${salesData.summary.couponDiscount.toLocaleString()}`,
      ],
    ];

    doc.autoTable({
      startY: 50,
      head: [["Metric", "Value"]],
      body: summaryData,
      theme: "grid",
    });

    doc.setFontSize(14);
    doc.text("Order Details", 14, doc.autoTable.previous.finalY + 20);

    const orderData = salesData.orders.map((order) => [
      order.orderId,
      format(new Date(order.createdAt), "MMM d, yyyy"),
      formatCurrency(order.totalAmount),
      formatCurrency(calculateTotalDiscount(order)),
      order.appliedCoupon?.couponCode || "-",
      (order.paymentMethod || "N/A").toUpperCase(),
      order.paymentStatus || "pending",
      (order.status || "pending").toUpperCase(),
    ]);

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 25,
      head: [
        [
          "Order ID",
          "Date",
          "Amount",
          "Total Discount",
          "Coupon",
          "Payment",
          "Pay Status",
          "Order Status",
        ],
      ],
      body: orderData,
      theme: "grid",
    });

    doc.save("sales-report.pdf");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-40 bg-gray-200 rounded mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Sales Report</h2>
        <button
          onClick={generatePDF}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <FiDownload />
          Download PDF
        </button>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              {...register("reportType")}
              onChange={handleReportTypeChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              {REPORT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {reportType === "custom" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      maxDate={endDate}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      minDate={startDate}
                      maxDate={new Date()}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  )}
                />
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-semibold">
              {salesData.summary.totalOrders || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-2xl font-semibold text-green-600">
              {formatCurrency(salesData.summary.totalAmount)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Discount</p>
            <p className="text-2xl font-semibold text-red-500">
              {formatCurrency(salesData.summary.totalDiscount)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Coupon Discount</p>
            <p className="text-2xl font-semibold text-orange-500">
              {formatCurrency(salesData.summary.couponDiscount)}
            </p>
          </div>
        </div>

        {/* <div className="mb-6">
          <BestSellingProducts
            dateRange={{
              startDate: watch("startDate"),
              endDate: watch("endDate"),
            }}
          />
        </div> */}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
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
                  Total Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coupon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentOrders.map((order) => (
                <tr key={order.orderId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderId}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                    {formatCurrency(calculateTotalDiscount(order))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.appliedCoupon ? (
                      <div>
                        <div className="font-medium">
                          {order.appliedCoupon.couponCode}
                        </div>
                        <div className="text-red-500">
                          -{formatCurrency(order.appliedCoupon.couponDiscount)}
                        </div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>
                      <div className="font-medium">
                        {(order.paymentMethod || "N/A").toUpperCase()}
                      </div>
                      <div
                        className={`text-sm ${
                          order.paymentStatus === "completed"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {order.paymentStatus || "pending"}
                      </div>
                    </div>
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

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
