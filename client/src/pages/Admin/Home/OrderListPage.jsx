import SearchBarAdmin from "@/components/Form/SearchBarAdmin";
import TableCreator from "@/components/Table/TableCreator";
import { orderTableHead } from "@/constants/admin/orders/orderList";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAllOrders } from "@/redux/features/allOrdersSlice";
import { toast } from "react-hot-toast";
import { adminCancelOrder, confirmDelivered } from "@/api/order/orderApi";

export default function OrderListPage() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.allOrders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleCancelOrder = async (orderId) => {
    try {
      await adminCancelOrder(orderId);
      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error(error.message || "Failed to cancel order");
    } finally {
      dispatch(fetchAllOrders());
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await confirmDelivered(orderId);
      toast.success("Order marked as completed");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to complete order");
    } finally {
      dispatch(fetchAllOrders());
    }
  };

  const tableActions = (order) => {
    return (
      <div className="flex justify-center gap-2">
        <>
        {order?.status === "delivered" && ["pending", "verified"].includes(order.paymentStatus) && (
            <button
              onClick={() => handleCompleteOrder(order._id)}
              className={`px-3 py-1 text-sm font-medium text-white rounded hover:opacity-90 ${
                order?.paymentStatus === "verified" 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={order?.paymentStatus === "verified"}
            >
              {order?.paymentStatus === "verified" ? "Order Confirmed" : "Confirm Delivered"}
            </button>
          )}
          {order?.status !== "delivered" && order?.status !== "cancelled" && (
            <button
              onClick={() => handleCancelOrder(order._id)}
              className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
            >
              Cancel Order
            </button>
          )}
        </>
        {order?.status && (
          <span
            className={`px-2 py-1 text-sm rounded ${getStatusColor(
              order.status
            )}`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        )}
      </div>
    );
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";

    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <SearchBarAdmin />
      <TableCreator
        tableHead={orderTableHead}
        tableBody={orders.map((order) => ({
          ...order,
          "product.name": order.product?.name || "N/A",
          "user.name": order.user?.name || "N/A",
        }))}
        actionsRenderer={tableActions}
      />
    </div>
  );
}
