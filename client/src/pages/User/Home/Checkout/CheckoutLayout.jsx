import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckoutProgress from "./CheckoutProgress";

const stepPaths = {
  "/home/checkout/delivery": 1,
  "/home/checkout/payment": 2,
  "/home/checkout/review": 3,
};

export default function CheckoutLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useSelector((state) => state.userCart);

  const currentStep = stepPaths[location.pathname] || 1;

  useEffect(() => {
    if (!cart?.items?.length) {
      navigate("/home/profile/cart");
      return;
    }

    const currentPathStep = stepPaths[location.pathname];
    if (!currentPathStep) {
      navigate("/home/checkout/delivery");
      return;
    }

    const selectedAddress = localStorage.getItem("selectedAddress");
    const selectedPayment = localStorage.getItem("selectedPayment");

    if (currentPathStep === 2 && !selectedAddress) {
      navigate("/home/checkout/delivery");
      return;
    }

    if (currentPathStep === 3 && (!selectedAddress || !selectedPayment)) {
      navigate(selectedAddress ? "/home/checkout/payment" : "/home/checkout/delivery");
      return;
    }
  }, [cart, location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 pt-[75px] pb-[100px]">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <CheckoutProgress currentStep={currentStep} />
          <div className="mt-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}