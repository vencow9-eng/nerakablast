import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "../pages/auth/Register";
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
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* MEMBER */}
        <Route
          element={
            <Protected>
              <DashboardLayout />
            </Protected>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/whatsapp" element={<Devices />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/targets" element={<Targets />} />
          <Route path="/blast" element={<Blast />} />
          <Route path="/reports" element={<Reports />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
