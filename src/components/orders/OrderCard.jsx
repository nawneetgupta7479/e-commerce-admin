import { useNavigate } from "react-router";
import { formatDate } from "../../lib/utils";
import { PackageIcon, MapPinIcon, CalendarIcon } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderStatusSelect from "./OrderStatusSelect";

function OrderCard({ order, onStatusChange, isUpdating }) {
  const navigate = useNavigate();

  const totalQuantity = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCardClick = () => {
    navigate(`/orders/${order._id}`);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div
            className="cursor-pointer hover:text-primary transition-colors"
            onClick={handleCardClick}
          >
            <span className="font-bold text-primary">#{order._id.slice(-8).toUpperCase()}</span>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Customer Info */}
        <div className="flex items-center gap-2 mt-2">
          <div className="avatar">
            <div className="w-8 rounded-full bg-base-200">
              {order.user?.imageUrl ? (
                <img src={order.user.imageUrl} alt={order.shippingAddress.fullName} />
              ) : (
                <span className="text-xs flex items-center justify-center h-full">
                  {order.shippingAddress.fullName.charAt(0)}
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="font-medium text-sm">{order.shippingAddress.fullName}</p>
            <p className="text-xs text-base-content/60 flex items-center gap-1">
              <MapPinIcon className="w-3 h-3" />
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
          </div>
        </div>

        {/* Order Info */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-base-200">
          <div className="flex items-center gap-1 text-sm">
            <PackageIcon className="w-4 h-4 text-base-content/60" />
            <span>{totalQuantity} items</span>
          </div>
          <span className="font-bold text-lg">${order.totalPrice.toFixed(2)}</span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1 text-xs text-base-content/60">
          <CalendarIcon className="w-3 h-3" />
          <span>{formatDate(order.createdAt)}</span>
        </div>

        {/* Actions */}
        <div className="card-actions justify-between items-center mt-3 pt-3 border-t border-base-200">
          <OrderStatusSelect
            status={order.status}
            onChange={(newStatus) => onStatusChange(order._id, newStatus)}
            isUpdating={isUpdating}
          />
          <button className="btn btn-sm btn-ghost" onClick={handleCardClick}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;