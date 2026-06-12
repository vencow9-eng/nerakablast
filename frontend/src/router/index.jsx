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

import Users from "../pages/admin/Users";
import AdminDevices from "../pages/admin/Devices";
import AdminReports from "../pages/admin/Reports";
import Settings from "../pages/admin/Settings";

function Protected({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  let user = {};
  let settings = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {}

  try {
    settings = JSON.parse(
      localStorage.getItem("sewawapro_settings_cache") || "{}"
    );
  } catch {}

  const isAdmin = user.role === "ADMIN";
  const maintenance = settings.maintenanceMode === true;

if (maintenance && user.role === "MEMBER") {
  return <MaintenancePage />;
}

  return children;
}

function MaintenancePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md text-center">
        <img
          src="/assets/logo.png"
          alt="SEWAWAPRO"
          className="h-12 mx-auto mb-6 object-contain"
        />

        <h1 className="text-3xl font-black mb-3">Maintenance Mode</h1>

        <p className="text-slate-400">
          Sistem sedang dalam peningkatan. Silakan coba lagi beberapa saat lagi.
        </p>
      </div>
    </div>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD */}
        <Route
          element={
            <Protected>
              <DashboardLayout />
            </Protected>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ADMIN */}
          <Route path="/users" element={<Users />} />
          <Route path="/admin-devices" element={<AdminDevices />} />
          <Route path="/admin-reports" element={<AdminReports />} />
          <Route path="/settings" element={<Settings />} />

          {/* MEMBER / SHARED */}
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
