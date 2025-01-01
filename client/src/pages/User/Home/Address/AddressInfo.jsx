import ButtonPrimary from "@/components/Buttons/ButtonPrimary";
import AddedAddress from "@/components/Address/AddedAddress";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  clearUserAddresses,
  fetchUserAddresses,
} from "@/redux/features/userAddressSlice";
import Modal from "@/components/Modal/Modal";
import EditAddress from "@/pages/User/Home/Address/EditAddress";

export default function AddressInfo() {
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
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Saved Addresses</h2>
        <ButtonPrimary onClick={() => navigate("/home/profile/address/add-address")}>
          Add New Address
        </ButtonPrimary>
      </div>
      <div className="flex flex-col gap-5">
        {addresses.map((address) => (
          <div key={address._id} className="border-2 p-5 flex justify-between rounded">
            <AddedAddress
              address={address}
              onEdit={() => handleEditAddress(address._id)}
            />
          </div>
        ))}
      </div>

      <Modal isOpen={isEditModalOpen} onClose={handleModalClose}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Edit Address</h2>
          <EditAddress addressData={selectedAddressId} onSuccess={handleModalClose} />
        </div>
      </Modal>
    </div>
  );
}
