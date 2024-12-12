import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { deleteAddress } from "@/api/address/addressApi";
import Modal from "../Modal/Modal";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function AddedAddress({ address, refresh }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteAddress = async () => {
    try {
      const data = { addressId: address._id };
      const response = await deleteAddress(data);
      if (response.success) {
        toast.success("Address deleted successfully");
        setIsOpen(false);
        dispatch(refresh());
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="border-2 p-5 flex justify-between rounded">
        <div className="text-lg">
          <div className="flex gap-5">
            <p className="font-semibold">{address.fullName}</p>
            <p>{address.phoneNumber}</p>
          </div>
          <p>{`${address.address}, ${address.district}, ${address.state} - ${address.pincode}`}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                navigate("/home/profile/address/edit-address", {
                  state: { addressId: address._id },
                })
              }
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => setIsOpen(true)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Modal isOpen={isOpen}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Confirm Deletion
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this address? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            onClick={handleDeleteAddress}
          >
            Delete
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}
