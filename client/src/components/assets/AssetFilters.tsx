import { Search, Filter } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;

  category: string;
  setCategory: (value: string) => void;

  onAdd: () => void;
}

const AssetFilters = ({
  search,
  setSearch,
  status,
  setStatus,
  category,
  setCategory,
  onAdd,
}: Props) => {
  return (
    <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">

        {/* Search */}

        <div className="relative lg:col-span-2">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search asset..."
            className="h-11 w-full rounded-xl border border-slate-200 pl-11 pr-4 outline-none focus:border-blue-500"
          />

        </div>

        {/* Category */}

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-11 rounded-xl border border-slate-200 px-3 outline-none focus:border-blue-500"
        >
          <option value="">All Categories</option>
          <option>Electronics</option>
          <option>Furniture</option>
          <option>Vehicles</option>
          <option>Meeting Rooms</option>
        </select>

        {/* Status */}

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-11 rounded-xl border border-slate-200 px-3 outline-none focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option>AVAILABLE</option>
          <option>ALLOCATED</option>
          <option>UNDER_MAINTENANCE</option>
          <option>LOST</option>
        </select>

      </div>

      <div className="mt-5 flex justify-end">

        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <Filter size={18} />

          + Register Asset

        </button>

      </div>

    </div>
  );
};

export default AssetFilters;