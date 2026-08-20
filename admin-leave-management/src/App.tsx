import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import EmployeeManagement from "./pages/EmployeeManagement";
import EmployeeProfile from "./pages/EmployeeProfile";
import LeaveManagement from "./pages/LeaveManagement";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <div className="app">

        <Sidebar />

        <main className="main-content">

          <Routes>

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* Employee Management */}
            <Route
              path="/employees"
              element={<EmployeeManagement />}
            />

            {/* Employee Profile */}
            <Route
              path="/employees/:id"
              element={<EmployeeProfile />}
            />

            {/* Leave Management */}
            <Route
              path="/leave-management"
              element={<LeaveManagement />}
            />

            {/* Default page */}
            <Route
              path="/"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

          </Routes>

        </main>

      </div>

    </BrowserRouter>
  );
}

export default App;