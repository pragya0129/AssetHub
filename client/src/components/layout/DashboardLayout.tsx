import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">

      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden relative">

        <Header />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;