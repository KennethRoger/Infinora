import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderCard from "@/components/Order/OrderCard";
import { ShoppingBag } from "lucide-react";
import Spinner from "@/components/Spinner/Spinner";
import {
  fetchUserOrders,
  clearOrders,
  selectUserOrders,
  selectUserOrdersLoading,
  selectUserOrdersError,
} from "@/redux/features/userOrderSlice";

export default function OrderPage() {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const loading = useSelector(selectUserOrdersLoading);
  const error = useSelector(selectUserOrdersError);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");

  useEffect(() => {
    dispatch(fetchUserOrders())
      .unwrap()
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });

    return () => {
      dispatch(clearOrders());
    };
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <ShoppingBag className="h-16 w-16 text-gray-400" />
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <ShoppingBag className="h-16 w-16 text-gray-400" />
        <p className="text-gray-500">No orders found</p>
      </div>
    );
  }

  const filteredOrders =
    orders?.filter((order) => {
      if (filter === "all") return true;
      return order.status === filter;
    }) || [];

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sort) {
      case "recent":
        return new Date(b.orderDate) - new Date(a.orderDate);
      case "oldest":
        return new Date(a.orderDate) - new Date(b.orderDate);
      case "high":
        return b.totalAmount - a.totalAmount;
      case "low":
        return a.totalAmount - b.totalAmount;
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border-gray-300 text-sm"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-md border-gray-300 text-sm"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="high">Price: High to Low</option>
            <option value="low">Price: Low to High</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {sortedOrders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}
