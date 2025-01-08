import { useEffect, useState } from "react";
import SearchBarAdmin from "@/components/Form/SearchBarAdmin";
import DataTable from "@/components/Table/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";

const orderStatusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const paymentStatusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  cod_pending: "bg-blue-100 text-blue-800",
  cod_received: "bg-green-100 text-green-800",
};

export default function UserOrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log("working")
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_USERS_API_BASE_URL}/api/order/vendor`,
        { withCredentials: true }
      );
      setOrders(response.data.orders);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `${
          import.meta.env.VITE_USERS_API_BASE_URL
        }/api/order/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filter === "all" || order.status === filter;
    const matchesSearch =
      searchQuery === "" ||
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sort) {
      case "newest":
        return new Date(b.orderDate) - new Date(a.orderDate);
      case "oldest":
        return new Date(a.orderDate) - new Date(b.orderDate);
      case "amount-high":
        return b.totalAmount - a.totalAmount;
      case "amount-low":
        return a.totalAmount - b.totalAmount;
      default:
        return 0;
    }
  });

  const renderCell = (key, order) => {
    switch (key) {
      case "orderId":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="font-medium text-sm text-blue-600">
                  {order.orderId.slice(-8).toUpperCase().concat("...")}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="font-medium text-sm">{order.orderId}</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "customer":
        return (
          <div>
            <div className="font-medium">{order.user.name}</div>
            <div className="text-sm text-gray-500">{order.user.email}</div>
          </div>
        );
      case "product":
        return (
          <div className="flex items-center gap-3">
            <img
              src={order.product.images[0]}
              alt={order.product.name}
              className="h-12 w-12 rounded-md object-cover"
            />
            <div className="font-medium">{order.product.name}</div>
          </div>
        );
      case "variants":
        if (!order.variants) return "No variants";
        return (
          <div className="space-y-1">
            {Object.entries(order.variants).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="font-medium">{key}:</span> {value}
              </div>
            ))}
          </div>
        );
      case "quantity":
        return order.quantity;
      case "price":
        return formatPrice(order.price); // Show base price per unit
      case "totalAmount":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-2">
                  <span>{formatPrice(order.finalAmount)}</span>
                  {(order.discount > 0 || order.appliedCoupon) && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(order.totalAmount)}
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1 text-sm">
                  <div>Subtotal: {formatPrice(order.totalAmount)}</div>
                  {order.discount > 0 && (
                    <div>Product Discount: -{formatPrice(order.productDiscount)}</div>
                  )}
                  {order.appliedCoupon && (
                    <div>Coupon Discount: -{formatPrice(order.appliedCoupon.couponDiscount)}</div>
                  )}
                  <div className="font-medium">Final Amount: {formatPrice(order.finalAmount)}</div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case "paymentStatus":
        return order.paymentMethod === "cod" ? (
          <Badge
            className={cn(
              "text-center",
              order.status === "delivered"
                ? paymentStatusColors.cod_received
                : paymentStatusColors.cod_pending
            )}
          >
            {order.status === "delivered" ? "Payment Received" : "Payment Due"}
          </Badge>
        ) : (
          <Badge className={paymentStatusColors[order.paymentStatus]}>
            {order.paymentStatus}
          </Badge>
        );
      case "paymentMethod":
        return (
          <Badge variant="outline" className="capitalize">
            {order.paymentMethod.toUpperCase()}
          </Badge>
        );
      case "orderDate":
        return formatDate(order.createdAt);
      case "status":
        return (
          <Badge
            className={`${orderStatusColors[order.status]} border px-2 py-1`}
          >
            {order.status}
          </Badge>
        );
      case "actions":
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {order.status !== "cancelled" && (
                <>
                  {order.status === "pending" && (
                    <DropdownMenuItem
                      onClick={() =>
                        handleUpdateStatus(order._id, "processing")
                      }
                    >
                      Mark as Processing
                    </DropdownMenuItem>
                  )}
                  {order.status === "processing" && (
                    <DropdownMenuItem
                      onClick={() => handleUpdateStatus(order._id, "shipped")}
                    >
                      Mark as Shipped
                    </DropdownMenuItem>
                  )}
                  {order.status === "shipped" && (
                    <DropdownMenuItem
                      onClick={() => handleUpdateStatus(order._id, "delivered")}
                    >
                      Mark as Delivered
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      default:
        return order[key];
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage your customer orders and update their status
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <SearchBarAdmin
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="amount-high">Amount: High to Low</SelectItem>
              <SelectItem value="amount-low">Amount: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={[
          { key: "orderId", label: "Order ID" },
          { key: "customer", label: "Customer" },
          { key: "product", label: "Product" },
          { key: "variants", label: "Variants" },
          { key: "quantity", label: "Quantity" },
          { key: "price", label: "Price" },
          { key: "totalAmount", label: "Total Amount" },
          { key: "paymentStatus", label: "Payment Status" },
          { key: "paymentMethod", label: "Payment Method" },
          { key: "orderDate", label: "Order Date" },
          { key: "status", label: "Status" },
          { key: "actions", label: "Actions" },
        ]}
        data={sortedOrders}
        renderCell={renderCell}
      />
    </div>
  );
}
