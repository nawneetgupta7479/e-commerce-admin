import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../lib/api";
import { formatDate } from "../lib/utils";
import { ArrowLeftIcon, PackageIcon, MailIcon } from "lucide-react";

// Components
import OrderStatusBadge from "../components/orders/OrderStatusBadge";
import OrderStatusSelect from "../components/orders/OrderStatusSelect";
import OrderItemCard from "../components/orders/OrderItemCard";
import OrderShippingInfo from "../components/orders/OrderShippingInfo";
import OrderPaymentInfo from "../components/orders/OrderPaymentInfo";
import OrderTimeline from "../components/orders/OrderTimeline";

function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderApi.getById(orderId),
  });

  const updateStatusMutation = useMutation({
    mutationFn: orderApi.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleStatusChange = (newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error || !data?.order) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center py-12">
          <PackageIcon className="w-16 h-16 mx-auto mb-4 opacity-40" />
          <p className="text-xl font-semibold mb-2">Order not found</p>
          <button className="btn btn-primary" onClick={() => navigate("/orders")}>
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const order = data.order;
  const totalQuantity = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="btn btn-circle btn-ghost btn-sm"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <OrderStatusBadge status={order.status} size="lg" />
            </div>
            <p className="text-base-content/70 mt-1 text-sm">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Status Update */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-base-content/70">Update Status:</span>
          <OrderStatusSelect
            status={order.status}
            onChange={handleStatusChange}
            isUpdating={updateStatusMutation.isPending}
          />
        </div>
      </div>

      {/* Email notification info */}
      {updateStatusMutation.isSuccess && (
        <div className="alert alert-success">
          <MailIcon className="w-5 h-5" />
          <span>Status updated! Email notification sent to customer.</span>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* LEFT COLUMN - Order Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer Info Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Customer</h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="avatar">
                  <div className="w-12 rounded-full bg-base-200">
                    {order.user?.imageUrl ? (
                      <img src={order.user.imageUrl} alt={order.user.name} />
                    ) : (
                      <span className="text-lg flex items-center justify-center h-full">
                        {order.shippingAddress.fullName.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="font-semibold">{order.user?.name || order.shippingAddress.fullName}</p>
                  <p className="text-sm text-base-content/60">{order.user?.email || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <h3 className="card-title text-lg">
                  <PackageIcon className="w-5 h-5" />
                  Order Items
                </h3>
                <span className="badge badge-ghost">{totalQuantity} items</span>
              </div>
              <div className="space-y-3 mt-4">
                {order.orderItems.map((item, index) => (
                  <OrderItemCard key={index} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Order Info */}
        <div className="space-y-4">
          {/* Payment Info */}
          <OrderPaymentInfo
            paymentResult={order.paymentResult}
            totalPrice={order.totalPrice}
          />

          {/* Shipping Info */}
          <OrderShippingInfo shippingAddress={order.shippingAddress} />

          {/* Order Timeline */}
          <OrderTimeline order={order} />
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;