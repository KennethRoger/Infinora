import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserOrders,
  selectUserOrders,
  selectUserOrdersLoading,
  selectUserOrdersError,
  selectUserOrdersPagination,
  clearOrders,
} from "@/redux/features/userOrderSlice";
import OrderCard from "@/components/Order/OrderCard";
import Pagination from "@/components/Pagination";
import { ShoppingBag } from "lucide-react";
import Spinner from "@/components/Spinner/Spinner";
import FailedOrdersSection from "./FailedOrdersSection";

export default function OrderPage() {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const loading = useSelector(selectUserOrdersLoading);
  const error = useSelector(selectUserOrdersError);
  const pagination = useSelector(selectUserOrdersPagination);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");

  const fetchOrders = (page) => {
    dispatch(fetchUserOrders({ page, limit: 10 }))
      .unwrap()
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  useEffect(() => {
    fetchOrders(1);
    return () => {
      dispatch(clearOrders());
    };
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    fetchOrders(newPage);
  };

  const getFilteredOrders = () => {
    let filtered = [...orders];
    if (filter !== "all") {
      filtered = filtered.filter((order) => order.status === filter);
    }
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
      <>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <FailedOrdersSection />
        </div>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <ShoppingBag className="h-16 w-16 text-gray-400" />
          <p className="text-gray-500">No orders found</p>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <FailedOrdersSection />
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

      <div className="space-y-4">
        {getFilteredOrders().map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            showPaymentStatus={true}
            showDeliveryStatus={true}
          />
        ))}
      </div>

      {!loading && orders.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {!loading && orders.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No orders found</p>
        </div>
      )}
    </div>
  );
}
