import { useEffect, useState } from "react";
import api from "../api/api";

interface Asset {
  id: number;
  asset_id?: number;
  asset_name: string;
  asset_tag: string;
  allocation_date?: string;
  allocated_date?: string;
  expected_return_date: string | null;
  status?: string;
  allocation_status?: string;
}

const formatDate = (date?: string | null) => {
  if (!date) {
    return "Not specified";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const MyAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAssets = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/allocations/my-assets");

        setAssets(response.data.data || []);
      } catch (error: any) {
        console.error(error);

        setError(
          error.response?.data?.message ||
          "Unable to load your assigned assets"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

          <p className="mt-4 text-slate-500">
            Loading your assets...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          My Assets
        </h1>

        <p className="mt-2 text-slate-500">
          View and manage the assets assigned to you
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      )}

      {assets.length === 0 ? (
        <div className="rounded-3xl border bg-white py-16 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-700">
            No assets assigned
          </h2>

          <p className="mt-2 text-slate-500">
            You currently have no allocated assets.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => {
            const allocationDate =
              asset.allocation_date ||
              asset.allocated_date;

            const status =
              asset.allocation_status ||
              asset.status ||
              "ACTIVE";

            return (
              <div
                key={asset.id || asset.asset_id}
                className="rounded-3xl border bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {asset.asset_name}
                    </h2>

                    <p className="mt-2 font-medium text-blue-600">
                      {asset.asset_tag}
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {status.replaceAll("_", " ")}
                  </span>
                </div>

                <div className="mt-7 space-y-5 border-t pt-6">
                  <div>
                    <p className="text-sm text-slate-500">
                      Allocated On
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {formatDate(allocationDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Expected Return
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {formatDate(
                        asset.expected_return_date
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default MyAssets;