import {
  CheckCircle2,
  ClipboardList,
  Wrench,
} from "lucide-react";

const activities = [
  {
    icon: ClipboardList,
    title: "Laptop Allocated",
    subtitle: "Rahul Sharma",
    color: "text-blue-600",
  },
  {
    icon: Wrench,
    title: "Maintenance Approved",
    subtitle: "Dell Latitude",
    color: "text-orange-500",
  },
  {
    icon: CheckCircle2,
    title: "Asset Returned",
    subtitle: "HP Monitor",
    color: "text-green-600",
  },
];

const RecentActivity = () => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-800">
        Recent Activity
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Latest system events
      </p>

      <div className="mt-6 space-y-6">
        {activities.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4"
          >
            <div
              className={`rounded-xl bg-slate-100 p-3 ${item.color}`}
            >
              <item.icon size={18} />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-slate-800">
                {item.title}
              </h3>

              <p className="text-sm text-slate-500">
                {item.subtitle}
              </p>
            </div>

            <span className="text-xs text-slate-400">
              Just now
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;