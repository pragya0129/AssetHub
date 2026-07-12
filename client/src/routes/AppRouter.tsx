import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import Organization from "../pages/Organization/Organization";
import Assets from "../pages/Assets/Assets";
import Allocation from "../pages/Allocation/Allocation";
import Booking from "../pages/Booking/Booking";
import Maintenance from "../pages/Maintenance/Maintenance";
import Audit from "../pages/Audit/Audit";
import Reports from "../pages/Reports/Reports";
import Notifications from "../pages/Notifications/Notifications";
import AI from "../pages/AI/AI";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="organization" element={<Organization />} />
          <Route path="assets" element={<Assets />} />
          <Route path="allocation" element={<Allocation />} />
          <Route path="booking" element={<Booking />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="audit" element={<Audit />} />
          <Route path="reports" element={<Reports />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="ai" element={<AI />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;