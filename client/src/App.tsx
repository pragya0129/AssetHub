import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login
  from "./pages/Login";

import Signup
  from "./pages/Signup";

import Dashboard
  from "./pages/Dashboard";

import ProtectedRoute
  from "./components/ProtectedRoute";

import {
  useAuth,
} from "./context/AuthContext";

import DashboardLayout from "./components/layout/DashboardLayout";
import Assets from "./pages/Assets";
import Allocations from "./pages/Allocations";
import MyAssets from "./pages/MyAssets";
import Maintenance from "./pages/Maintenance";

const App = () => {

  const {
    isAuthenticated,
    user,
  } = useAuth();

  const isAdmin =
    user?.role === "ADMIN" ||
    user?.role === "ASSET_MANAGER";


  return (
    <Routes>

      <Route
        path="/"

        element={

          <Navigate

            to={
              isAuthenticated

                ? "/dashboard"

                : "/login"
            }

            replace

          />

        }
      />


      <Route
        path="/login"

        element={
          <Login />
        }
      />


      <Route
        path="/signup"

        element={
          <Signup />
        }
      />


      <Route element={<ProtectedRoute />}>

        <Route element={<DashboardLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/assets"
            element={
              isAdmin
                ? <Assets />
                : <Navigate to="/dashboard" replace />
            }
          />

          <Route
            path="/allocations"
            element={
              isAdmin
                ? <Allocations />
                : <Navigate to="/dashboard" replace />
            }
          />

          <Route
            path="/my-assets"
            element={<MyAssets />}
          />

          <Route
            path="/maintenance"
            element={<Maintenance />}
          />

        </Route>

      </Route>


      <Route
        path="*"

        element={

          <Navigate

            to="/"

            replace

          />

        }
      />

    </Routes>
  );
};


export default App;