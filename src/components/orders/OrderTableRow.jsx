import { useNavigate } from "react-router";
import { formatDate } from "../../lib/utils";
import OrderStatusSelect from "./OrderStatusSelect";

function OrderTableRow({ order, onStatusChange, isUpdating }) {
  const navigate = useNavigate();

  const totalQuantity = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleRowClick = () => {
    navigate(`/orders/${order._id}`);
  };

  return (
    <tr className="hover">
      <td>
        <span
          className="font-medium text-primary cursor-pointer hover:underline"
          onClick={handleRowClick}
        >
          #{order._id.slice(-8).toUpperCase()}
        </span>
      </td>

      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full bg-base-200">
              {order.user?.imageUrl ? (
                <img src={order.user.imageUrl} alt={order.shippingAddress.fullName} />
              ) : (
                <span className="text-sm flex items-center justify-center h-full">
                  {order.shippingAddress.fullName.charAt(0)}
                </span>
              )}
            </div>
          </div>
          <div>
            <div className="font-medium">{order.shippingAddress.fullName}</div>
            <div className="text-sm opacity-60">
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </div>
          </div>
        </div>
      </td>

      <td>
        <div className="font-medium">{totalQuantity} items</div>
        <div className="text-sm opacity-60">
          {order.orderItems[0]?.name}
          {order.orderItems.length > 1 && ` +${order.orderItems.length - 1} more`}
        </div>
      </td>

      <td>
        <span className="font-semibold">${order.totalPrice.toFixed(2)}</span>
      </td>

      <td>
        <OrderStatusSelect
          status={order.status}
          onChange={(newStatus) => onStatusChange(order._id, newStatus)}
          isUpdating={isUpdating}
        />
      </td>

      <td>
        <span className="text-sm opacity-60">{formatDate(order.createdAt)}</span>
      </td>

      <td>
        <button className="btn btn-sm btn-ghost" onClick={handleRowClick}>
          View
        </button>
      </td>
    </tr>
  );
}

export default OrderTableRow;