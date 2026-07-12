import api from "../../api/api";
import type { Asset } from "../../types/asset";
import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

interface Props {
  assets: Asset[];
  refresh: () => void;
  isAdmin: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-100 text-green-700";

    case "ALLOCATED":
      return "bg-blue-100 text-blue-700";

    case "UNDER_MAINTENANCE":
      return "bg-orange-100 text-orange-700";

    case "LOST":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

const AssetTable = ({
  assets,
  refresh,
  isAdmin,
}: Props) => {

  const deleteAsset = async (id: number) => {

    const confirmDelete = window.confirm(
      "Delete this asset?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(`/assets/${id}`);

      refresh();

    } catch (err) {

      console.log(err);

      alert("Unable to delete asset");

    }

  };
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

      <table className="min-w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-6 py-4 text-left">Asset</th>

            <th className="px-6 py-4 text-left">Category</th>

            <th className="px-6 py-4 text-left">Condition</th>

            <th className="px-6 py-4 text-left">Location</th>

            <th className="px-6 py-4 text-left">Status</th>

            <th className="px-6 py-4 text-center">Actions</th>

          </tr>

        </thead>

        <tbody>

          {assets.length === 0 ? (

            <tr>

              <td
                colSpan={6}
                className="py-12 text-center text-slate-500"
              >
                No assets found.
              </td>

            </tr>

          ) : (

            assets.map((asset) => (

              <tr
                key={asset.id}
                className="border-t transition hover:bg-slate-50"
              >

                <td className="px-6 py-5">

                  <h3 className="font-semibold text-slate-800">
                    {asset.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {asset.asset_tag}
                  </p>

                </td>

                <td className="px-6 py-5">
                  {asset.category_name}
                </td>

                <td className="px-6 py-5">
                  {asset.asset_condition}
                </td>

                <td className="px-6 py-5">
                  {asset.location}
                </td>

                <td className="px-6 py-5">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                      asset.status
                    )}`}
                  >
                    {asset.status.replaceAll("_", " ")}
                  </span>

                </td>

               <td className="px-6 py-5">

  {
    isAdmin ? (

      <div className="flex justify-center gap-2">

        <button className="rounded-lg p-2 hover:bg-slate-100">
          <Eye size={18} />
        </button>

        <button className="rounded-lg p-2 hover:bg-blue-100 hover:text-blue-600">
          <Pencil size={18} />
        </button>

        <button
          onClick={() => deleteAsset(asset.id)}
          className="rounded-lg p-2 hover:bg-red-100 hover:text-red-600"
        >
          <Trash2 size={18} />
        </button>

      </div>

    ) : (

      <span className="text-sm text-slate-400">
        View Only
      </span>

    )
  }

</td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
};

export default AssetTable;