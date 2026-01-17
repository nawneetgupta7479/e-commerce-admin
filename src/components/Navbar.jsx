import { UserButton } from "@clerk/clerk-react";
import { useLocation } from "react-router";

import {
  LayoutDashboardIcon,
  PackageIcon,
  ShoppingCartIcon,
  UsersIcon,
  TicketIcon,
  MenuIcon,
  LogOutIcon,
} from "lucide-react";

// eslint-disable-next-line
export const NAVIGATION = [
  {
    name: "Dashboard",
    path: "/",
    icon: <LayoutDashboardIcon className="size-5" />,
  },
  {
    name: "Products",
    path: "/products",
    icon: <PackageIcon className="size-5" />,
  },
  {
    name: "Orders",
    path: "/orders",
    icon: <ShoppingCartIcon className="size-5" />,
  },
  {
    name: "Customers",
    path: "/customers",
    icon: <UsersIcon className="size-5" />,
  },
  {
    name: "Support Tickets",
    path: "/issues",
    icon: <TicketIcon className="size-5" />,
  },
];

function Navbar() {
  const location = useLocation();

  return (
    <div className="navbar w-full bg-base-300">
      <label htmlFor="my-drawer" className="btn btn-square btn-ghost" aria-label="open sidebar">
        <MenuIcon className="size-5" />
      </label>

      <div className="flex-1 px-4">
        <h1 className="text-xl font-bold">
          {NAVIGATION.find((item) => item.path === location.pathname)?.name || "Dashboard"}
        </h1>
      </div>

      <div className="mr-5">
        <UserButton />
      </div>
    </div>
  );
}

export default Navbar;
