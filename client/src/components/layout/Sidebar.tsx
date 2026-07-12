import {
  LayoutDashboard,
  Laptop,
  ClipboardList,
  Wrench,
  Boxes,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const menus = [
    { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { title: "Assets", path: "/assets", icon: Laptop },
    { title: "Allocations", path: "/allocations", icon: ClipboardList },
    { title: "My Assets", path: "/my-assets", icon: Boxes },
    { title: "Maintenance", path: "/maintenance", icon: Wrench },
  ];

  return (
    <aside className="w-72 bg-slate-950 text-slate-200 flex flex-col h-screen border-r border-slate-900">
      {/* LOGO AREA */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-lg font-bold text-white shadow-blue-500/20 shadow-lg">
            A
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AssetFlow</h1>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400">
              Enterprise ERP
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 space-y-1">
        <p className="mb-2 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-600">
          Main Menu
        </p>
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `group flex items-center justify-between rounded-lg px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-slate-900 text-white font-medium border-l-4 border-blue-500"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <menu.icon size={18} />
              <span>{menu.title}</span>
            </div>
            {/* Show chevron only on hover for a cleaner look */}
            <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* USER PROFILE */}
      <div className="p-5 border-t border-slate-900">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-sm font-bold text-white">
            {user?.name?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h3 className="text-sm font-semibold text-white truncate">{user?.name}</h3>
            <p className="text-xs text-slate-500 truncate">{user?.role}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 py-2.5 text-sm font-medium text-slate-300 hover:border-red-900/50 hover:text-red-400 hover:bg-red-950/20 transition-all"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;