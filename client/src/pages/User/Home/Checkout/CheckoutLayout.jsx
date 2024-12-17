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

  // Get current step based on path
  const currentStep = stepPaths[location.pathname] || 1;

  // Protect checkout routes
  useEffect(() => {
    // Redirect to cart if no items
    if (!cart?.items?.length) {
      navigate("/home/cart");
      return;
    }

    // Prevent skipping steps
    const currentPathStep = stepPaths[location.pathname];
    if (!currentPathStep) {
      navigate("/home/checkout/delivery");
      return;
    }

    // Check if previous step is completed
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
          
          {/* Main Content */}
          <div className="mt-8">
            <Outlet />
          </div>

          {/* Order Summary (can be added later) */}
          {/* <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
            Order summary component here
          </div> */}
        </div>
      </div>
    </div>
  );
}