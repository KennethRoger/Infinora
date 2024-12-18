import { Check, Truck, CreditCard, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    name: "Delivery",
    icon: Truck,
    path: "/home/checkout/delivery",
  },
  {
    id: 2,
    name: "Payment",
    icon: CreditCard,
    path: "/home/checkout/payment",
  },
  {
    id: 3,
    name: "Review",
    icon: ClipboardList,
    path: "/home/checkout/review",
  },
];

export default function CheckoutProgress({ currentStep }) {
  return (
    <div className="w-full py-4 sm:py-6">
      <div className="mx-auto max-w-3xl">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li
                key={step.name}
                className={cn(
                  stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : "",
                  "relative"
                )}
              >
                {step.id < currentStep ? (
                  
                  <>
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="h-0.5 w-full bg-primary" />
                    </div>
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                      <Check
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                      <span className="sr-only">{step.name}</span>
                    </div>
                  </>
                ) : step.id === currentStep ? (
                  <>
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="h-0.5 w-full bg-gray-200" />
                    </div>
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-white">
                      <step.icon
                        className="h-4 w-4 text-primary"
                        aria-hidden="true"
                      />
                      <span className="sr-only">{step.name}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="h-0.5 w-full bg-gray-200" />
                    </div>
                    <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                      <step.icon
                        className="h-4 w-4 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="sr-only">{step.name}</span>
                    </div>
                  </>
                )}

                <div className="absolute left-1/2 -translate-x-1/2 mt-3">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      step.id < currentStep
                        ? "text-primary"
                        : step.id === currentStep
                        ? "text-primary"
                        : "text-gray-500"
                    )}
                  >
                    {step.name}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
