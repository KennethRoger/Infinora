import ButtonPrimary from "@/components/Buttons/ButtonPrimary";
import AddedAddress from "@/components/Address/AddedAddress";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  clearUserAddresses,
  fetchUserAddresses,
} from "@/redux/features/userAddressSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Modal from "@/components/Modal/Modal";
import EditAddress from "@/pages/User/Home/Address/EditAddress";

export default function AddressInfo() {
  const [maxAddressCountReached, setMaxAddressCountReached] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const { addresses, loading, error } = useSelector(
    (state) => state.userAddresses
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserAddresses());
    return () => {
      dispatch(clearUserAddresses());
    };
  }, [dispatch]);

  useEffect(() => {
    setMaxAddressCountReached(addresses.length === 5);
  }, [addresses]);

  const handleEditAddress = (addressId) => {
    setSelectedAddressId(addressId);
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedAddressId(null);
    dispatch(fetchUserAddresses());
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <h1 className="text-2xl font-bold">User Address</h1>
      <div className="flex justify-between mt-10">
        {maxAddressCountReached ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <button
                  className="border px-5 py-2 shadow-md text-lg bg-gray-500 text-white rounded"
                  disabled
                >
                  Add address
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-gray-100">
                <p>Max address limit reached: 5</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <ButtonPrimary
            onClick={() => navigate("/home/profile/address/add-address")}
            attributes={maxAddressCountReached ? "disabled" : ""}
          >
            Add address
          </ButtonPrimary>
        )}
      </div>
      <div className="mt-5 flex flex-col gap-5">
        {addresses.map((address) => (
          <div key={address._id} className="border-2 p-5 flex justify-between rounded">
            <AddedAddress
              address={address}
              onEdit={() => handleEditAddress(address._id)}
            />
          </div>
        ))}
      </div>

      {/* Edit Address Modal */}
      <Modal isOpen={isEditModalOpen} onClose={handleModalClose}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Edit Address</h2>
          <EditAddress addressData={selectedAddressId} onSuccess={handleModalClose} />
        </div>
      </Modal>
    </>
  );
}
