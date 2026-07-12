import {
  Boxes,
  CheckCircle2,
  ClipboardList,
  Wrench,
} from "lucide-react";

import StatCard from "./StatCard";

interface Props {
  data: {
    totalAssets: number;
    availableAssets: number;
    allocatedAssets: number;
    underMaintenance: number;
  };
}

const KPIGrid = ({ data }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Assets"
        value={data.totalAssets}
        icon={<Boxes size={24} />}
        color="bg-blue-600"
      />

      <StatCard
        title="Available"
        value={data.availableAssets}
        icon={<CheckCircle2 size={24} />}
        color="bg-green-600"
      />

      <StatCard
        title="Allocated"
        value={data.allocatedAssets}
        icon={<ClipboardList size={24} />}
        color="bg-indigo-600"
      />

      <StatCard
        title="Maintenance"
        value={data.underMaintenance}
        icon={<Wrench size={24} />}
        color="bg-orange-500"
      />
    </div>
  );
};

export default KPIGrid;