import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../lib/api";
import { ShoppingCartIcon } from "lucide-react";

// Components
import OrderFilters from "../components/orders/OrderFilters";
import OrderCard from "../components/orders/OrderCard";
import OrderTableRow from "../components/orders/OrderTableRow";

function OrdersPage() {
  const [filterStatus, setFilterStatus] = useState("");
  const queryClient = useQueryClient();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["orders", filterStatus],
    queryFn: () => orderApi.getAll({ status: filterStatus }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: orderApi.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const orders = ordersData?.orders || [];

  // Count orders by status
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const shippedCount = orders.filter((o) => o.status === "shipped").length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Orders</h1>
          <p className="text-base-content/70 mt-1 text-sm sm:text-base">
            Manage customer orders
          </p>
        </div>

        {/* Stats Badges */}
        <div className="flex flex-wrap gap-2">
          <div className="badge badge-warning gap-1 p-3">
            {pendingCount} Pending
          </div>
          <div className="badge badge-info gap-1 p-3">
            {shippedCount} Shipped
          </div>
          <div className="badge badge-success gap-1 p-3">
            {deliveredCount} Delivered
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <OrderFilters filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

      {/* ORDERS LIST */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : orders.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-center py-12 text-base-content/60">
              <ShoppingCartIcon className="w-16 h-16 mx-auto mb-4 opacity-40" />
              <p className="text-lg sm:text-xl font-semibold mb-2">No orders found</p>
              <p className="text-sm">
                {filterStatus
                  ? `No ${filterStatus} orders at the moment`
                  : "Orders will appear here once customers make purchases"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW - Card Layout */}
          <div className="grid grid-cols-1 gap-4 sm:hidden">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onStatusChange={handleStatusChange}
                isUpdating={updateStatusMutation.isPending}
              />
            ))}
          </div>

          {/* DESKTOP VIEW - Table Layout */}
          <div className="card bg-base-100 shadow-xl hidden sm:block">
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <OrderTableRow
                        key={order._id}
                        order={order}
                        onStatusChange={handleStatusChange}
                        isUpdating={updateStatusMutation.isPending}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default OrdersPage;
