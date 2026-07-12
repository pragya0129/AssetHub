import {
  Bell,
  Search,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Header = () => {

  const { user } = useAuth();

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning ☀️"
      : hour < 17
      ? "Good Afternoon 🌤️"
      : "Good Evening 🌙";

  const today = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <header className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur">

      <div>

        <h1 className="text-3xl font-bold text-slate-900">
          {greeting}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Welcome back,
          <span className="font-semibold text-slate-700">
            {" "}
            {user?.name}
          </span>
        </p>

        <p className="text-xs text-slate-400">
          {today}
        </p>

      </div>

      <div className="flex items-center gap-5">

        <div className="relative hidden lg:block">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            placeholder="Search assets..."
            className="h-11 w-72 rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white"
          />

        </div>

        <button className="relative rounded-xl border border-slate-200 bg-white p-3 transition hover:bg-slate-100">

          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500"></span>

        </button>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white">

            {user?.name?.charAt(0)}

          </div>

          <div className="hidden sm:block">

            <h3 className="text-sm font-semibold text-slate-800">

              {user?.name}

            </h3>

            <p className="text-xs text-slate-500">

              {user?.role}

            </p>

          </div>

        </div>

      </div>

    </header>
  );

};

export default Header;