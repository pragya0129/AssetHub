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


const App = () => {

  const {
    isAuthenticated,
  } = useAuth();


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


      <Route
        element={
          <ProtectedRoute />
        }
      >

        <Route
          path="/dashboard"

          element={
            <Dashboard />
          }
        />

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