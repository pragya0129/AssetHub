import { useEffect, useState } from "react";
import api from "../api/api";

interface Maintenance {
  id: number;
  asset_name: string;
  asset_tag: string;
  issue_description: string;
  priority: string;
  status: string;
  requested_by_name: string;
  created_at: string;
}

const badge = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";

    case "APPROVED":
      return "bg-blue-100 text-blue-700";

    case "IN_PROGRESS":
      return "bg-orange-100 text-orange-700";

    case "COMPLETED":
      return "bg-green-100 text-green-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

const Maintenance = () => {
  const [requests, setRequests] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const res = await api.get("/maintenance");

      setRequests(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

          <p className="mt-4 text-slate-500">
            Loading maintenance...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Maintenance
        </h1>

        <p className="mt-2 text-slate-500">
          Track maintenance requests
        </p>

      </div>

      <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">

        <table className="min-w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-4 text-left">
                Asset
              </th>

              <th className="px-6 py-4 text-left">
                Issue
              </th>

              <th className="px-6 py-4 text-left">
                Priority
              </th>

              <th className="px-6 py-4 text-left">
                Requested By
              </th>

              <th className="px-6 py-4 text-left">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {requests.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="py-12 text-center text-slate-500"
                >

                  No maintenance requests

                </td>

              </tr>

            ) : (

              requests.map((item) => (

                <tr
                  key={item.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="px-6 py-5">

                    <h3 className="font-semibold">

                      {item.asset_name}

                    </h3>

                    <p className="text-sm text-slate-500">

                      {item.asset_tag}

                    </p>

                  </td>

                  <td className="px-6 py-5">

                    {item.issue_description}

                  </td>

                  <td className="px-6 py-5">

                    {item.priority}

                  </td>

                  <td className="px-6 py-5">

                    {item.requested_by_name}

                  </td>

                  <td className="px-6 py-5">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${badge(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </>
  );
};

export default Maintenance;