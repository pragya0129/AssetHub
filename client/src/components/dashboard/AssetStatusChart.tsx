import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  data: {
    availableAssets: number;
    allocatedAssets: number;
    underMaintenance: number;
    lostAssets?: number;
  };
}

const COLORS = [
  "#22C55E",
  "#2563EB",
  "#F59E0B",
  "#EF4444",
];

const AssetStatusChart = ({ data }: Props) => {
  const chartData = [
    {
      name: "Available",
      value: data.availableAssets,
    },
    {
      name: "Allocated",
      value: data.allocatedAssets,
    },
    {
      name: "Maintenance",
      value: data.underMaintenance,
    },
    {
      name: "Lost",
      value: data.lostAssets || 0,
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Asset Distribution
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Current lifecycle status of all assets
        </p>
      </div>

      <div className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend
              verticalAlign="bottom"
              height={40}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AssetStatusChart;