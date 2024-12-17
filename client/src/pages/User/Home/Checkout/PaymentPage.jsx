import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedPayment } from "@/redux/features/userOrderSlice";
import ButtonPrimary from "@/components/Buttons/ButtonPrimary";
import { Banknote } from "lucide-react";

const paymentMethods = [
  {
    id: "cod",
    name: "Cash on Delivery",
    description: "Pay with cash when your order arrives",
    icon: Banknote,
  },
  // Add more payment methods here later
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { checkout } = useSelector((state) => state.order);

  const handleMethodSelect = (methodId) => {
    dispatch(setSelectedPayment(methodId));
  };

  const handleContinue = () => {
    if (checkout.selectedPaymentMethod) {
      navigate("/home/checkout/review");
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Select Payment Method</h2>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                checkout.selectedPaymentMethod === method.id
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleMethodSelect(method.id)}
            >
              <div className="flex items-start gap-4">
                <input
                  type="radio"
                  name="payment-method"
                  checked={checkout.selectedPaymentMethod === method.id}
                  onChange={() => handleMethodSelect(method.id)}
                  className="mt-1"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <method.icon className="h-5 w-5 text-gray-600" />
                    <h3 className="font-medium">{method.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{method.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <ButtonPrimary
          onClick={handleContinue}
          disabled={!checkout.selectedPaymentMethod}
          className="w-full sm:w-auto"
        >
          Continue to Review
        </ButtonPrimary>
      </div>
    </div>
  );
}
