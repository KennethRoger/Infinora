import SearchBarAdmin from "@/components/Form/SearchBarAdmin";
import TableCreator from "@/components/Table/TableCreator";
import { orderTableHead } from "@/constants/admin/orders/orderList";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAllOrders } from "@/redux/features/allOrdersSlice";
import { toast } from "react-hot-toast";
import { adminCancelOrder, confirmDelivered } from "@/api/order/orderApi";
import Modal from "@/components/Modal/Modal";
import Pagination from "@/components/Pagination";

export default function OrderListPage() {
  const dispatch = useDispatch();
  const { orders, loading, error, pagination } = useSelector((state) => state.allOrders);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeliveredModal, setShowDeliveredModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handlePageChange = (page) => {
    dispatch(fetchAllOrders({ page }));
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await adminCancelOrder(orderId);
      toast.success("Order cancelled successfully");
      setShowCancelModal(false);
      setSelectedOrder(null);
      dispatch(fetchAllOrders());
    } catch (error) {
      toast.error(error.message || "Failed to cancel order");
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await confirmDelivered(orderId);
      toast.success("Order marked as completed");
      setShowDeliveredModal(false);
      setSelectedOrder(null);
      dispatch(fetchAllOrders());
    } catch (error) {
      toast.error(error.message || "Failed to complete order");
    }
  };

  const tableActions = (order) => {
    return (
      <div className="flex justify-center gap-2">
        <>
          {order?.status === "delivered" && (
            <button
              onClick={() => {
                setSelectedOrder(order);
                setShowDeliveredModal(true);
              }}
              className={`px-3 py-1 text-sm font-medium text-white rounded hover:opacity-90 ${
                order?.paymentStatus === "completed"
                  ? "bg-blue-600 hover:bg-blue-700 pointer-events-none"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={order?.paymentStatus === "confirmed"}
            >
              {order?.paymentStatus === "completed"
                ? "Order Confirmed"
                : "Confirm Delivered"}
            </button>
          )}
          {!["delivered", "cancelled"].includes(order?.status) && (
            <button
              onClick={() => {
                setSelectedOrder(order);
                setShowCancelModal(true);
              }}
              className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
            >
              Cancel Order
            </button>
          )}
        </>
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
          "user.email": order?.user?.email,
          "product.name": order.product?.name || "N/A",
          "user.name": order.user?.name || "N/A",
        }))}
        actionsRenderer={tableActions}
      />

      {!loading && pagination?.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <Modal isOpen={showCancelModal}>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Cancel Order</h3>
          <p className="mb-6">Are you sure you want to cancel this order?</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleCancelOrder(selectedOrder?._id)}
              className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
            >
              Yes, Cancel
            </button>
            <button
              onClick={() => {
                setShowCancelModal(false);
                setSelectedOrder(null);
              }}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
            >
              No, Keep Order
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showDeliveredModal}>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Confirm Delivery</h3>
          <p className="mb-6">
            Are you sure you want to mark this order as delivered?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleCompleteOrder(selectedOrder?._id)}
              className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
            >
              Yes, Confirm
            </button>
            <button
              onClick={() => {
                setShowDeliveredModal(false);
                setSelectedOrder(null);
              }}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
            >
              No, Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
