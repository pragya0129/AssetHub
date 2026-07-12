import { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

interface MaintenanceRequest {
  id: number;
  asset_name: string;
  asset_tag: string;
  issue_description: string;
  priority: string;
  status: string;
  requested_by_name?: string;
  technician_name?: string;
  resolution_notes?: string;
  created_at: string;
}

interface AllocatedAsset {
  allocation_id: number;
  asset_id: number;
  asset_tag: string;
  name: string;
  category_name: string;
}

interface StatusData {
  technicianName?: string;
  resolutionNotes?: string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "APPROVED":
      return "bg-blue-100 text-blue-700";
    case "TECHNICIAN_ASSIGNED":
      return "bg-purple-100 text-purple-700";
    case "IN_PROGRESS":
      return "bg-orange-100 text-orange-700";
    case "RESOLVED":
      return "bg-green-100 text-green-700";
    case "REJECTED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "CRITICAL":
      return "bg-red-100 text-red-700";
    case "HIGH":
      return "bg-orange-100 text-orange-700";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";
    case "LOW":
      return "bg-green-100 text-green-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const Maintenance = () => {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [assets, setAssets] = useState<AllocatedAsset[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    assetId: "",
    issueDescription: "",
    priority: "MEDIUM",
  });

  const { user } = useAuth();

  const isManager =
    user?.role === "ASSET_MANAGER" ||
    user?.role === "ADMIN";

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      if (isManager) {
        const response = await api.get("/maintenance");

        setRequests(response.data.data || []);
      } else {
        const [maintenanceResponse, assetsResponse] =
          await Promise.all([
            api.get("/maintenance/my-requests"),
            api.get("/allocations/my-assets"),
          ]);

        setRequests(
          maintenanceResponse.data.data || []
        );

        setAssets(
          assetsResponse.data.data || []
        );
      }
    } catch (error: any) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to load maintenance data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.assetId ||
      !form.issueDescription.trim()
    ) {
      setError(
        "Select an asset and describe the issue"
      );

      return;
    }

    try {
      setSubmitting(true);

      await api.post("/maintenance", {
        assetId: Number(form.assetId),
        issueDescription:
          form.issueDescription.trim(),
        priority: form.priority,
      });

      setSuccess(
        "Maintenance request submitted successfully"
      );

      setForm({
        assetId: "",
        issueDescription: "",
        priority: "MEDIUM",
      });

      setShowForm(false);

      await loadData();
    } catch (error: any) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to submit maintenance request"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (
    requestId: number,
    status: string,
    additionalData: StatusData = {}
  ) => {
    try {
      setUpdatingId(requestId);
      setError("");
      setSuccess("");

      await api.patch(
        `/maintenance/${requestId}/status`,
        {
          status,
          ...additionalData,
        }
      );

      setSuccess(
        `Maintenance request updated to ${status
          .replaceAll("_", " ")
          .toLowerCase()}`
      );

      await loadData();
    } catch (error: any) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to update maintenance request"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const renderManagerActions = (
    request: MaintenanceRequest
  ) => {
    const isUpdating =
      updatingId === request.id;

    switch (request.status) {
      case "PENDING":
        return (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                updateStatus(
                  request.id,
                  "APPROVED"
                )
              }
              className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating
                ? "Updating..."
                : "Approve"}
            </button>

            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                updateStatus(
                  request.id,
                  "REJECTED"
                )
              }
              className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        );

      case "APPROVED":
        return (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => {
              const technicianName =
                window.prompt(
                  "Enter technician name"
                );

              if (technicianName?.trim()) {
                updateStatus(
                  request.id,
                  "TECHNICIAN_ASSIGNED",
                  {
                    technicianName:
                      technicianName.trim(),
                  }
                );
              }
            }}
            className="rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating
              ? "Updating..."
              : "Assign Technician"}
          </button>
        );

      case "TECHNICIAN_ASSIGNED":
        return (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() =>
              updateStatus(
                request.id,
                "IN_PROGRESS"
              )
            }
            className="rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating
              ? "Updating..."
              : "Start Work"}
          </button>
        );

      case "IN_PROGRESS":
        return (
          <button
            type="button"
            disabled={isUpdating}
            onClick={() => {
              const resolutionNotes =
                window.prompt(
                  "Enter resolution notes"
                );

              if (resolutionNotes?.trim()) {
                updateStatus(
                  request.id,
                  "RESOLVED",
                  {
                    resolutionNotes:
                      resolutionNotes.trim(),
                  }
                );
              }
            }}
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating
              ? "Updating..."
              : "Resolve"}
          </button>
        );

      case "RESOLVED":
        return (
          <span className="text-sm font-semibold text-green-600">
            Completed
          </span>
        );

      case "REJECTED":
        return (
          <span className="text-sm font-semibold text-red-600">
            Rejected
          </span>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

          <p className="mt-4 text-slate-500">
            Loading maintenance...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Maintenance
          </h1>

          <p className="mt-2 text-slate-500">
            {isManager
              ? "Review and manage employee maintenance requests"
              : "Report and track issues with your assigned assets"}
          </p>
        </div>

        {!isManager && (
          <button
            type="button"
            onClick={() => {
              setShowForm(true);
              setError("");
              setSuccess("");
            }}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            + Raise Request
          </button>
        )}
      </div>

      {/* Messages */}

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          {error}
        </div>
      )}

      {/* Employee maintenance form */}

      {showForm && !isManager && (
        <div className="mb-8 rounded-3xl border bg-white p-7 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Raise Maintenance Request
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Report an issue with one of your
                assigned assets
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowForm(false)
              }
              className="text-2xl text-slate-400 hover:text-slate-700"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-semibold">
                  Asset
                </label>

                <select
                  value={form.assetId}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      assetId:
                        event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="">
                    Select an assigned asset
                  </option>

                  {assets.map((asset) => (
                    <option
                      key={asset.asset_id}
                      value={asset.asset_id}
                    >
                      {asset.name} —{" "}
                      {asset.asset_tag}
                    </option>
                  ))}
                </select>

                {assets.length === 0 && (
                  <p className="mt-2 text-sm text-orange-600">
                    You currently have no
                    allocated assets.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Priority
                </label>

                <select
                  value={form.priority}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      priority:
                        event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="LOW">
                    Low
                  </option>

                  <option value="MEDIUM">
                    Medium
                  </option>

                  <option value="HIGH">
                    High
                  </option>

                  <option value="CRITICAL">
                    Critical
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block font-semibold">
                Describe the issue
              </label>

              <textarea
                rows={4}
                value={
                  form.issueDescription
                }
                onChange={(event) =>
                  setForm({
                    ...form,
                    issueDescription:
                      event.target.value,
                  })
                }
                placeholder="Example: Laptop overheats and shuts down after twenty minutes"
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                className="rounded-xl border px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  submitting ||
                  assets.length === 0
                }
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Maintenance table */}

      <div className="overflow-x-auto rounded-3xl border bg-white shadow-sm">
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

              {isManager && (
                <th className="px-6 py-4 text-left">
                  Requested By
                </th>
              )}

              <th className="px-6 py-4 text-left">
                Status
              </th>

              <th className="px-6 py-4 text-left">
                Submitted
              </th>

              {isManager && (
                <th className="px-6 py-4 text-left">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    isManager ? 7 : 5
                  }
                  className="py-14 text-center text-slate-500"
                >
                  {isManager
                    ? "No employee maintenance requests"
                    : "No maintenance requests yet"}
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

                  <td className="max-w-xs px-6 py-5">
                    {item.issue_description}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getPriorityBadge(
                        item.priority
                      )}`}
                    >
                      {item.priority}
                    </span>
                  </td>

                  {isManager && (
                    <td className="px-6 py-5">
                      {item.requested_by_name ||
                        "Unknown"}
                    </td>
                  )}

                  <td className="px-6 py-5">
                    <span
                      className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                        item.status
                      )}`}
                    >
                      {item.status.replaceAll(
                        "_",
                        " "
                      )}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-500">
                    {new Date(
                      item.created_at
                    ).toLocaleDateString()}
                  </td>

                  {isManager && (
                    <td className="whitespace-nowrap px-6 py-5">
                      {renderManagerActions(
                        item
                      )}
                    </td>
                  )}
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