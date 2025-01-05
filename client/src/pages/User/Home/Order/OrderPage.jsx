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

  const getFilteredOrders = () => {
    let filtered = [...orders];

    // Filter orders
    if (filter !== "all") {
      filtered = filtered.filter((order) => order.status === filter);
    }

    // Sort orders
    switch (sort) {
      case "recent":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "price-high":
        filtered.sort((a, b) => b.totalAmount - a.totalAmount);
        break;
      case "price-low":
        filtered.sort((a, b) => a.totalAmount - b.totalAmount);
        break;
      default:
        break;
    }

    return filtered;
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <div className="flex gap-4">
          <select
            className="border rounded-md px-3 py-1"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            className="border rounded-md px-3 py-1"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {getFilteredOrders().map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            showPaymentStatus={true}
            showDeliveryStatus={true}
          />
        ))}
      </div>
    </div>
  );
}
