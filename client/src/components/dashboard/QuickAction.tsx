import {
  ArrowRight,
  ClipboardList,
  Plus,
  Wrench,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const actions = [
  {
    title: "Register Asset",
    description: "Add a new asset into inventory",
    icon: Plus,
    color: "bg-blue-600",
    path: "/assets",
  },
  {
    title: "Allocate Asset",
    description: "Assign assets to employees",
    icon: ClipboardList,
    color: "bg-green-600",
    path: "/allocations",
  },
  {
    title: "Maintenance",
    description: "View maintenance requests",
    icon: Wrench,
    color: "bg-orange-500",
    path: "/maintenance",
  },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-slate-800">
        Quick Actions
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Frequently used shortcuts
      </p>

      <div className="mt-6 space-y-4">
        {actions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.path)}
            className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-white hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${action.color}`}
              >
                <action.icon size={22} />
              </div>

              <div className="text-left">
                <h3 className="font-semibold text-slate-800">
                  {action.title}
                </h3>

                <p className="text-sm text-slate-500">
                  {action.description}
                </p>
              </div>
            </div>

            <ArrowRight
              size={18}
              className="text-slate-400 transition-transform group-hover:translate-x-1"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;