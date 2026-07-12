import type { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}

const StatCard = ({
  title,
  value,
  icon,
  color,
}: Props) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      <div className="flex justify-between">

        <div>

          <p className="text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            {value}
          </h2>

        </div>

        <div
          className={`h-14 w-14 rounded-xl flex items-center justify-center text-white ${color}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
};

export default StatCard;