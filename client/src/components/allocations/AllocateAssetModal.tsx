import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "../../api/api";

interface Props {
  close: () => void;
  refresh: () => void;
}

interface Asset {
  id: number;
  name: string;
  asset_tag: string;
}

interface Employee {
  id: number;
  name: string;
}

const AllocateAssetModal = ({
  close,
  refresh,
}: Props) => {

  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [assetId, setAssetId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const loadData = async () => {
    try {

      const assetRes =
        await api.get("/assets");

      setAssets(assetRes.data.data);

      const employeeRes =
        await api.get("/users");

      setEmployees(employeeRes.data.data);

    } catch (err) {

      console.log(err);

    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const allocate = async () => {
    try {

      await api.post("/allocations", {
        assetId,
        employeeId,
        expectedReturnDate: returnDate,
      });

      refresh();

      close();

    } catch (err) {

      console.log(err);

      alert("Unable to allocate asset");

    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-2xl font-bold">
            Allocate Asset
          </h2>

          <button
            onClick={close}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X />
          </button>

        </div>

        <div className="space-y-5 p-6">

          <div>

            <label className="mb-2 block text-sm font-medium">
              Asset
            </label>

            <select
              value={assetId}
              onChange={(e) =>
                setAssetId(e.target.value)
              }
              className="w-full rounded-xl border p-3"
            >
              <option value="">
                Select Asset
              </option>

              {assets.map((asset) => (
                <option
                  key={asset.id}
                  value={asset.id}
                >
                  {asset.asset_tag} - {asset.name}
                </option>
              ))}

            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Employee
            </label>

            <select
              value={employeeId}
              onChange={(e) =>
                setEmployeeId(e.target.value)
              }
              className="w-full rounded-xl border p-3"
            >
              <option value="">
                Select Employee
              </option>

              {employees.map((employee) => (
                <option
                  key={employee.id}
                  value={employee.id}
                >
                  {employee.name}
                </option>
              ))}

            </select>

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Expected Return Date
            </label>

            <input
              type="date"
              value={returnDate}
              onChange={(e) =>
                setReturnDate(e.target.value)
              }
              className="w-full rounded-xl border p-3"
            />

          </div>

        </div>

        <div className="flex justify-end gap-3 border-t p-6">

          <button
            onClick={close}
            className="rounded-xl border px-5 py-3"
          >
            Cancel
          </button>

          <button
            onClick={allocate}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
          >
            Allocate
          </button>

        </div>

      </div>

    </div>
  );
};

export default AllocateAssetModal;