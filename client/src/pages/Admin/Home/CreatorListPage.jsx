import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import SearchBarAdmin from "@/components/Form/SearchBarAdmin";
import TableCreator from "@/components/Table/TableCreator";
import Modal from "@/components/Modal/Modal";
import { creatorTableHead } from "@/constants/admin/creators/creators";
import { nonVerifiedCreatorTableHead } from "@/constants/admin/creators/creatorApproval";
import { fetchUsers } from "@/redux/features/userSlice";
import { approveVendor, rejectVendor } from "@/api/vendorApi";

export default function CreatorListPage() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const pendingCreators = users.filter(
    (user) => user.isVerified && user.vendorStatus === "pending"
  );

  const approvedCreators = users.filter(
    (user) => user.isVerified && user.vendorStatus === "approved"
  );

  const handleApproveClick = (creator) => {
    setSelectedCreator(creator);
    setShowApproveModal(true);
  };

  const handleRejectClick = (creator) => {
    setSelectedCreator(creator);
    setShowRejectModal(true);
  };

  const handleApproveConfirm = async () => {
    try {
      const response = await approveVendor({
        creatorId: selectedCreator._id,
      });

      if (response.success) {
        toast.success(
          `Successfully approved ${selectedCreator.name} as a creator!`
        );
        setShowApproveModal(false);
        setSelectedCreator(null);
        dispatch(fetchUsers()); // Refresh the list
      } else {
        throw new Error(response.message || "Failed to approve creator");
      }
    } catch (error) {
      console.error("Error approving creator:", error);
      toast.error(
        error.message || "Failed to approve creator. Please try again."
      );
    }
  };

  const handleRejectConfirm = async () => {
    try {
      const response = await rejectVendor({
        creatorId: selectedCreator._id,
      });

      if (response.success) {
        toast.success(
          `Successfully rejected ${selectedCreator.name}'s creator application`
        );
        setShowRejectModal(false);
        setSelectedCreator(null);
        dispatch(fetchUsers()); // Refresh the list
      } else {
        throw new Error(response.message || "Failed to reject creator");
      }
    } catch (error) {
      console.error("Error rejecting creator:", error);
      toast.error(
        error.message || "Failed to reject creator. Please try again."
      );
    }
  };

  const creatorVerificationButton = (creator) => (
    <button
      className="border min-w-[100px] rounded h-10 shadow-md text-lg bg-[#00B69B] text-white"
      onClick={() => console.log("Viewing...\nData: ", creator)}
    >
      View
    </button>
  );

  const tableActions = (creator) => (
    <div className="flex justify-center gap-2">
      <button
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        onClick={() => handleApproveClick(creator)}
      >
        Approve
      </button>
      <button
        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
        onClick={() => handleRejectClick(creator)}
      >
        Reject
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading creators...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading creators: {error}
      </div>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-bold">Creator Requests</h1>
      <SearchBarAdmin />
      <TableCreator
        tableHead={nonVerifiedCreatorTableHead}
        tableBody={pendingCreators}
        actionsRenderer={tableActions}
        extraActionRenderer={creatorVerificationButton}
      />
      <h1 className="text-4xl mt-10 font-bold">Creators</h1>
      <SearchBarAdmin />
      <TableCreator
        tableHead={creatorTableHead}
        tableBody={approvedCreators}
        actionsRenderer={tableActions}
      />

      {/* Approve Modal */}
      <Modal isOpen={showApproveModal}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Confirm Creator Approval</h2>
          <p className="mb-6">
            Are you sure you want to approve {selectedCreator?.name} as a
            creator? This action will give them access to creator features.
          </p>
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              onClick={() => setShowApproveModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleApproveConfirm}
            >
              Approve
            </button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={showRejectModal}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            Warning: Creator Rejection
          </h2>
          <p className="mb-6">
            Are you sure you want to reject {selectedCreator?.name}'s creator
            application? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              onClick={() => setShowRejectModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleRejectConfirm}
            >
              Reject
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
