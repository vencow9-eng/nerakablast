import { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import api from "../services/api";

export default function DashboardLayout() {
  const [user, setUser] = useState(null);

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  useEffect(() => {
    api.get("/auth/me")
      .then((res) => {
        setUser(res.data.data);
      })
      .catch(() => {
 setUser({
   username: "nerakablast",
   role: "ADMIN"
 });
});
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      <aside className="w-[260px] bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-green-500 flex items-center justify-center font-black text-xl">
              N
            </div>

            <h1 className="text-2xl font-black tracking-tight">
              NERAKABLAST
            </h1>
          </div>
        </div>

        <nav className="flex flex-col gap-2 px-4 py-6">
          <Link className="p-3 rounded-xl hover:bg-slate-800" to="/dashboard">
            🏠 Dashboard
          </Link>

          <Link className="p-3 rounded-xl hover:bg-slate-800" to="/devices">
            📱 WhatsApp
          </Link>

          <Link className="p-3 rounded-xl hover:bg-slate-800" to="/templates">
            📝 Templates
          </Link>

          <Link className="p-3 rounded-xl hover:bg-slate-800" to="/targets">
            🎯 Targets
          </Link>

          <Link className="p-3 rounded-xl hover:bg-slate-800" to="/blast">
            🚀 Blast
          </Link>

          <Link className="p-3 rounded-xl hover:bg-slate-800" to="/reports">
            📊 Reports
          </Link>
        </nav>

        <div className="mt-auto p-5">
          <div className="bg-slate-800 p-4 rounded-2xl mb-4">
            <div className="font-bold">
              {user?.username || "Loading..."}
            </div>

            <div className="text-slate-400 text-sm">
              {user?.role || "USER"}
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>

      <section className="flex-1 overflow-y-auto">
        <header className="h-[78px] border-b border-slate-800 flex items-center justify-between px-10">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
          </div>

          <Link
            to="/blast"
            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold"
          >
            + Start Blast
          </Link>
        </header>

        <main className="p-10">
          <Outlet />
        </main>
      </section>
    </div>
  );
}