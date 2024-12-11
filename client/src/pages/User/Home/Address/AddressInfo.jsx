import ButtonPrimary from "@/components/Buttons/ButtonPrimary";
import AddedAddress from "@/components/Address/AddedAddress";
import { useNavigate } from "react-router-dom";

export default function AddressInfo() {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="text-2xl font-bold">User Address</h1>
      <div className="flex justify-between mt-10">
        <ButtonPrimary onClick={() => navigate("/home/profile/address/add-address")}>
          Add Address
        </ButtonPrimary>
        {/* <p className="text-red-600">Maximum address exceeded</p> */}
      </div>
      <div className="mt-5">
        <AddedAddress />
      </div>
    </>
  );
}
