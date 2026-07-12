import { Bell, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 border-b bg-white flex items-center justify-between px-8">

      <div>

        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500">
          Welcome back, {user?.name}
        </p>

      </div>

      <div className="flex items-center gap-5">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            placeholder="Search assets..."
            className="h-11 w-72 rounded-xl border border-slate-200 pl-11 pr-4 outline-none focus:border-blue-500"
          />

        </div>

        <button className="relative rounded-xl border p-3 hover:bg-slate-100">

          <Bell size={20} />

          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500"></span>

        </button>

      </div>

    </header>
  );
};

export default Header;