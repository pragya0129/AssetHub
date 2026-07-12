import { useEffect, useState } from "react";
import api from "../api/api";

import KPIGrid from "../components/dashboard/KPIGrid";
import QuickActions from "../components/dashboard/QuickAction";
import AssetStatusChart from "../components/dashboard/AssetStatusChart";
import RecentAssets from "../components/dashboard/RecentAssets";
import RecentActivity from "../components/dashboard/RecentActivity";

interface DashboardData {
  kpis: {
    totalAssets: number;
    availableAssets: number;
    allocatedAssets: number;
    underMaintenance: number;
    lostAssets: number;
  };

  recentAssets: any[];
}

const Dashboard = () => {
  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] =
    useState(true);
  

  const loadDashboard = async () => {
    try {
      const res = await api.get("/dashboard");

      setDashboard(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

          <p className="mt-4 text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
        <h2 className="text-2xl font-bold">
          Unable to load dashboard
        </h2>

        <button
          onClick={loadDashboard}
          className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* KPI Cards */}

      <KPIGrid
        data={dashboard.kpis}
      />

      {/* Charts */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        <div className="xl:col-span-2">

          <AssetStatusChart
            data={dashboard.kpis}
          />

        </div>

       <QuickActions />

      </div>

      {/* Bottom */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <RecentAssets
          assets={dashboard.recentAssets}
        />

        <RecentActivity />

      </div>

    </div>
  );
};

export default Dashboard;