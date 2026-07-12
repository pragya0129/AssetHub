import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <Sidebar />

        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute right-4 top-4 text-white"
        >
          <X size={24} />
        </button>
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex items-center border-b bg-white px-4 lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="mr-3 rounded-lg p-2 text-slate-700 hover:bg-slate-100"
          >
            <Menu size={24} />
          </button>

          <div className="min-w-0 flex-1">
            <Header />
          </div>
        </div>

        <div className="hidden lg:block">
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;