import { Bell, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="flex min-h-20 w-full items-center justify-between gap-3 border-b bg-white px-4 sm:px-6 lg:px-8">
      <div className="min-w-0">
        <p className="truncate text-sm text-slate-500 sm:text-base">
          Welcome back, {user?.name}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4 lg:gap-5">
        <div className="relative hidden md:block">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            placeholder="Search assets..."
            className="h-11 w-52 rounded-xl border border-slate-200 pl-11 pr-4 outline-none focus:border-blue-500 lg:w-72"
          />
        </div>

        <button className="rounded-xl border p-2.5 text-slate-600 hover:bg-slate-100 md:hidden">
          <Search size={20} />
        </button>

        <button className="relative rounded-xl border p-2.5 hover:bg-slate-100 sm:p-3">
          <Bell size={20} />

          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500" />
        </button>
      </div>
    </header>
  );
};

export default Header;