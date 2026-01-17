import { MapPinIcon, PhoneIcon, UserIcon } from "lucide-react";

function OrderShippingInfo({ shippingAddress }) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title text-lg">
          <MapPinIcon className="w-5 h-5" />
          Shipping Address
        </h3>
        <div className="space-y-3 mt-2">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-base-content/60" />
            <span className="font-medium">{shippingAddress.fullName}</span>
          </div>
          <div className="text-base-content/70">
            <p>{shippingAddress.streetAddress}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PhoneIcon className="w-4 h-4 text-base-content/60" />
            <span>{shippingAddress.phoneNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderShippingInfo;