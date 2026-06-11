import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";

import DashboardLayout from "../layouts/DashboardLayout";

import Dashboard from "../pages/member/Dashboard";
import Devices from "../pages/member/Devices";

import Templates from "../pages/member/Templates";
import Targets from "../pages/member/Targets";
import Blast from "../pages/member/Blast";
import Reports from "../pages/member/Reports";

function Protected({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return null;
  }

  return children;
}

export default function Router() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
  element={
    <Protected>
      <DashboardLayout />
    </Protected>
  }
>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/devices"
            element={<Devices />}
          />

          <Route
            path="/templates"
            element={<Templates />}
          />

          <Route
            path="/targets"
            element={<Targets />}
          />

          <Route
            path="/blast"
            element={<Blast />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}