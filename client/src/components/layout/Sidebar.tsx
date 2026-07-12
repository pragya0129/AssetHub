import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Boxes,
  ArrowRightLeft,
  CalendarDays,
  Wrench,
  ClipboardCheck,
  BarChart3,
  Bell,
  Bot,
} from "lucide-react";

const menus = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Organization", icon: Building2, path: "/organization" },
  { title: "Assets", icon: Boxes, path: "/assets" },
  { title: "Allocation", icon: ArrowRightLeft, path: "/allocation" },
  { title: "Booking", icon: CalendarDays, path: "/booking" },
  { title: "Maintenance", icon: Wrench, path: "/maintenance" },
  { title: "Audit", icon: ClipboardCheck, path: "/audit" },
  { title: "Reports", icon: BarChart3, path: "/reports" },
  { title: "Notifications", icon: Bell, path: "/notifications" },
  { title: "AI Assistant", icon: Bot, path: "/ai" },
];

const Sidebar = () => {
  return (
    <aside className="w-72 h-screen bg-[#111827] border-r border-slate-800 flex flex-col">

      <div className="px-8 py-8">

        <h1 className="text-3xl font-bold text-white">
          AssetFlow
        </h1>

        <p className="text-slate-400 mt-2 text-sm">
          Enterprise ERP
        </p>

      </div>

      <nav className="flex-1 px-4 space-y-2">

        {menus.map((menu) => {

          const Icon = menu.icon;

          return (

            <NavLink
              key={menu.title}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-5 py-4 transition-all duration-300

                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />

              {menu.title}

            </NavLink>

          );
        })}

      </nav>

      <div className="p-5">

        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-5">

          <h2 className="font-semibold text-white">
            AI Enabled
          </h2>

          <p className="text-sm text-blue-100 mt-2">
            Offline Sync Ready
          </p>

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;