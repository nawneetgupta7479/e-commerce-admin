import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Outlet } from "react-router";
// import { setGetTokenFn } from "../lib/axios.js";
import { setGetTokenFn } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout() {
  const { getToken } = useAuth();

  useEffect(() => {
    setGetTokenFn(getToken);
  }, [getToken]);

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" defaultChecked />

      <div className="drawer-content">
        <Navbar />

        <main className="p-6 max-sm:p-3">
          <Outlet />
        </main>
      </div>

      <Sidebar />
    </div>
  );
}

export default DashboardLayout;
