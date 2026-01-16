import { useQuery } from "@tanstack/react-query";
import { customerApi } from "../lib/api";
import { formatDate } from "../lib/utils";
import { MapPinIcon, HeartIcon, CalendarIcon } from "lucide-react";

function CustomersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: customerApi.getAll,
  });

  const customers = data?.customers || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Customers</h1>
        <p className="text-base-content/70 mt-1 text-sm sm:text-base">
          {customers.length} {customers.length === 1 ? "customer" : "customers"} registered
        </p>
      </div>

      {/* LOADING STATE */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : customers.length === 0 ? (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-center py-12 text-base-content/60">
              <p className="text-lg sm:text-xl font-semibold mb-2">No customers yet</p>
              <p className="text-sm">Customers will appear here once they sign up</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW - Card Layout */}
          <div className="grid grid-cols-1 gap-4 sm:hidden">
            {customers.map((customer) => (
              <div key={customer._id} className="card bg-base-100 shadow-xl">
                <div className="card-body p-4">
                  {/* Customer Header */}
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img
                          src={customer.imageUrl}
                          alt={customer.name}
                          className="w-12 h-12 rounded-full"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{customer.name}</h3>
                      <p className="text-sm text-base-content/70 truncate">{customer.email}</p>
                    </div>
                  </div>

                  {/* Customer Stats */}
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-base-200">
                    <div className="badge badge-ghost gap-1">
                      <MapPinIcon className="w-3 h-3" />
                      {customer.addresses?.length || 0} address(es)
                    </div>
                    <div className="badge badge-ghost gap-1">
                      <HeartIcon className="w-3 h-3" />
                      {customer.wishlist?.length || 0} item(s)
                    </div>
                  </div>

                  {/* Joined Date */}
                  <div className="flex items-center gap-1 mt-2 text-xs text-base-content/60">
                    <CalendarIcon className="w-3 h-3" />
                    Joined {formatDate(customer.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW - Table Layout */}
          <div className="card bg-base-100 shadow-xl hidden sm:block">
            <div className="card-body">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Addresses</th>
                      <th>Wishlist</th>
                      <th>Joined Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer._id}>
                        <td className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-12 rounded-full">
                              <img
                                src={customer.imageUrl}
                                alt={customer.name}
                                className="w-12 h-12 rounded-full"
                              />
                            </div>
                          </div>
                          <div className="font-semibold">{customer.name}</div>
                        </td>

                        <td>{customer.email}</td>

                        <td>
                          <div className="badge badge-ghost">
                            {customer.addresses?.length || 0} address(es)
                          </div>
                        </td>

                        <td>
                          <div className="badge badge-ghost">
                            {customer.wishlist?.length || 0} item(s)
                          </div>
                        </td>

                        <td>
                          <span className="text-sm opacity-60">{formatDate(customer.createdAt)}</span>
                        </td>
                      </tr>
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

export default CustomersPage;
