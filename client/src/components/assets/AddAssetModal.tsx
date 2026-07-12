import { useState } from "react";
import { X, PackagePlus } from "lucide-react";
import api from "../../api/api";

interface Props {
  close: () => void;
  refresh: () => void;
}

const AddAssetModal = ({ close, refresh }: Props) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    categoryId: 1,
    serialNumber: "",
    acquisitionDate: "",
    acquisitionCost: "",
    condition: "GOOD",
    location: "",
    isBookable: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setForm({
      ...form,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    });
  };

  const saveAsset = async () => {
    if (!form.name.trim()) {
      alert("Asset name is required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/assets", {
        ...form,
        acquisitionCost:
          Number(form.acquisitionCost) || 0,
      });

      refresh();

      close();
    } catch (err) {
      console.log(err);

      alert("Unable to create asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 p-6">

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-blue-100 p-3">

              <PackagePlus
                className="text-blue-600"
                size={24}
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-slate-800">
                Register Asset
              </h2>

              <p className="text-sm text-slate-500">
                Add a new organization asset
              </p>

            </div>

          </div>

          <button
            onClick={close}
            className="rounded-xl p-2 hover:bg-slate-100"
          >
            <X />
          </button>

        </div>

        {/* Body */}

        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm font-medium">
              Asset Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Dell Latitude 5440"
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Serial Number
            </label>

            <input
              name="serialNumber"
              value={form.serialNumber}
              onChange={handleChange}
              placeholder="SN-001"
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Category
            </label>

            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            >
              <option value={1}>
                Electronics
              </option>

              <option value={2}>
                Furniture
              </option>

              <option value={3}>
                Vehicles
              </option>

              <option value={4}>
                Meeting Rooms
              </option>

            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Condition
            </label>

            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            >
              <option>
                EXCELLENT
              </option>

              <option>
                GOOD
              </option>

              <option>
                FAIR
              </option>

              <option>
                DAMAGED
              </option>

            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Acquisition Date
            </label>

            <input
              type="date"
              name="acquisitionDate"
              value={form.acquisitionDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Cost (₹)
            </label>

            <input
              name="acquisitionCost"
              value={form.acquisitionCost}
              onChange={handleChange}
              placeholder="85000"
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />

          </div>

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium">
              Location
            </label>

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="IT Department"
              className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />

          </div>

          <div className="md:col-span-2">

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

              <input
                type="checkbox"
                name="isBookable"
                checked={form.isBookable}
                onChange={handleChange}
              />

              <span className="font-medium">
                This asset can be booked
              </span>

            </label>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-4 border-t border-slate-200 p-6">

          <button
            onClick={close}
            className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={saveAsset}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : "Save Asset"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default AddAssetModal;