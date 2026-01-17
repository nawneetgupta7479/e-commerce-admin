import { formatDate } from "../../lib/utils";
import { CheckCircleIcon, TruckIcon, PackageIcon, ClockIcon } from "lucide-react";

function OrderTimeline({ order }) {
  const steps = [
    {
      label: "Order Placed",
      date: order.createdAt,
      completed: true,
      icon: PackageIcon,
    },
    {
      label: "Shipped",
      date: order.shippedAt,
      completed: order.status === "shipped" || order.status === "delivered",
      icon: TruckIcon,
    },
    {
      label: "Delivered",
      date: order.deliveredAt,
      completed: order.status === "delivered",
      icon: CheckCircleIcon,
    },
  ];

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title text-lg">
          <ClockIcon className="w-5 h-5" />
          Order Timeline
        </h3>
        <ul className="steps steps-vertical mt-4">
          {steps.map((step, index) => (
            <li
              key={index}
              className={`step ${step.completed ? "step-primary" : ""}`}
              data-content={step.completed ? "✓" : "○"}
            >
              <div className="text-left ml-2">
                <p className={`font-medium ${step.completed ? "" : "text-base-content/50"}`}>
                  {step.label}
                </p>
                {step.date && (
                  <p className="text-xs text-base-content/60">{formatDate(step.date)}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default OrderTimeline;