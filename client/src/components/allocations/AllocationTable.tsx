import {
  RotateCcw,
} from "lucide-react";

interface Allocation {
  id: number;
  asset_tag: string;
  asset_name: string;
  employee_name: string;
  department_name: string;
  allocated_date: string;
  expected_return_date: string;
  status: string;
}

interface Props {
  allocations: Allocation[];
}

const badgeColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-700";

    case "RETURNED":
      return "bg-blue-100 text-blue-700";

    case "OVERDUE":
      return "bg-red-100 text-red-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

const AllocationTable = ({
  allocations,
}: Props) => {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm border">

      <table className="min-w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-6 py-4 text-left">
              Asset
            </th>

            <th className="px-6 py-4 text-left">
              Employee
            </th>

            <th className="px-6 py-4 text-left">
              Department
            </th>

            <th className="px-6 py-4 text-left">
              Return Date
            </th>

            <th className="px-6 py-4 text-left">
              Status
            </th>

            <th className="px-6 py-4 text-center">
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {allocations.length === 0 ? (

            <tr>

              <td
                colSpan={6}
                className="py-12 text-center text-slate-500"
              >

                No allocations found.

              </td>

            </tr>

          ) : (

            allocations.map((item) => (

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

                  {item.employee_name}

                </td>

                <td className="px-6 py-5">

                  {item.department_name}

                </td>

                <td className="px-6 py-5">

                  {item.expected_return_date}

                </td>

                <td className="px-6 py-5">

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeColor(
                      item.status
                    )}`}
                  >

                    {item.status}

                  </span>

                </td>

                <td className="px-6 py-5">

                  <div className="flex justify-center">

                    <button className="rounded-lg p-2 hover:bg-green-100 hover:text-green-700">

                      <RotateCcw size={18} />

                    </button>

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
};

export default AllocationTable;