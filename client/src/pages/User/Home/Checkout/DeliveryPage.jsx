import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAddresses } from "@/redux/features/userAddressSlice";
import { setSelectedAddress } from "@/redux/features/userOrderSlice";
import ButtonPrimary from "@/components/Buttons/ButtonPrimary";
import AddedAddress from "@/components/Address/AddedAddress";
import { MapPin, Plus } from "lucide-react";

export default function DeliveryPage() {
  const { addresses, loading, error } = useSelector(
    (state) => state.userAddresses
  );
  const { checkout } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserAddresses());
  }, [dispatch]);

  const handleAddressSelect = (addressId) => {
    dispatch(setSelectedAddress(addressId));
  };

  const handleContinue = () => {
    if (checkout.selectedAddressId) {
      navigate("/home/checkout/payment");
    }
  };

  if (loading)
    return <div className="text-center py-8">Loading addresses...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Select Delivery Address
          </h2>
          {addresses.length < 5 && (
            <button
              onClick={() => navigate("/home/profile/address/add-address")}
              className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Add New Address
            </button>
          )}
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No addresses found</p>
            <ButtonPrimary
              onClick={() => navigate("/home/profile/address/add-address")}
            >
              Add New Address
            </ButtonPrimary>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                  checkout.selectedAddressId === address._id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleAddressSelect(address._id)}
              >
                <div className="flex items-start gap-4">
                  <input
                    type="radio"
                    name="address"
                    checked={checkout.selectedAddressId === address._id}
                    onChange={() => handleAddressSelect(address._id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <AddedAddress address={address} hideActions />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <ButtonPrimary
          onClick={handleContinue}
          disabled={!checkout.selectedAddressId}
          className="w-full sm:w-auto"
        >
          Continue to Payment
        </ButtonPrimary>
      </div>
    </div>
  );
}
