import {
  ArrowRight,
  Laptop,
} from "lucide-react";

interface Asset {
  id: number;
  asset_tag: string;
  name: string;
  category_name: string;
  status: string;
  location: string;
}

interface Props {
  assets: Asset[];
}

const statusColor = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-100 text-green-700";

    case "ALLOCATED":
      return "bg-blue-100 text-blue-700";

    case "UNDER_MAINTENANCE":
      return "bg-orange-100 text-orange-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

const RecentAssets = ({ assets }: Props) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Recent Assets
          </h2>

          <p className="text-sm text-slate-500">
            Latest registered assets
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {assets.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 py-10 text-center">
            <Laptop
              className="mx-auto text-slate-300"
              size={40}
            />

            <p className="mt-3 text-slate-500">
              No assets found
            </p>
          </div>
        )}

        {assets.slice(0, 5).map((asset) => (
          <div
            key={asset.id}
            className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition-all hover:shadow-md"
          >
            <div>
              <h3 className="font-semibold text-slate-800">
                {asset.name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {asset.asset_tag} • {asset.category_name}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {asset.location}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
                  asset.status
                )}`}
              >
                {asset.status.replaceAll("_", " ")}
              </span>

              <ArrowRight
                className="text-slate-400"
                size={18}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAssets;