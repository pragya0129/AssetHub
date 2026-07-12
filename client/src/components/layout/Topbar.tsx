import {
  Bell,
  Search,
  Sparkles,
  Wifi,
} from "lucide-react";

const Topbar = () => {
  return (
    <header className="h-20 bg-[#0F172A]/80 backdrop-blur-xl border-b border-slate-800 px-8 flex items-center justify-between">

      {/* Left */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-slate-400 mt-1">
          Welcome back 👋
        </p>
      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Search */}

        <div className="hidden lg:flex items-center gap-3 bg-slate-800 rounded-xl px-4 py-3 w-80">

          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search assets..."
            className="bg-transparent outline-none text-white placeholder:text-slate-500 w-full"
          />

        </div>

        {/* Online Status */}

        <div className="hidden md:flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl">

          <Wifi size={16} />

          <span className="text-sm font-medium">
            Online
          </span>

        </div>

        {/* AI */}

        <button className="bg-gradient-to-r from-blue-600 to-cyan-500 p-3 rounded-xl hover:scale-105 transition">

          <Sparkles
            className="text-white"
            size={18}
          />

        </button>

        {/* Notification */}

        <button className="relative bg-slate-800 p-3 rounded-xl hover:bg-slate-700 transition">

          <Bell
            className="text-white"
            size={18}
          />

          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>

        </button>

        {/* User */}

        <div className="flex items-center gap-3 bg-slate-800 px-3 py-2 rounded-xl">

          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-white">

            H

          </div>

          <div className="hidden md:block">

            <h4 className="text-white font-semibold">
              Harshiya
            </h4>

            <p className="text-slate-400 text-sm">
              Admin
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default Topbar;