import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminDevices() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState("");

  async function load() {
    try {
      const res = await api.get("/devices/admin/all");
      setDevices(res.data.data || []);
    } catch (e) {
      alert(e.response?.data?.message || "Gagal load devices");
    }
  }

  useEffect(() => {
    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, []);

  const filtered = devices.filter((d) =>
    String(d.username || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-28">
      <div>
        <h1 className="text-3xl md:text-5xl font-black">Admin Devices</h1>
        <p className="text-slate-400 mt-2">
          Pantau semua WhatsApp yang terhubung per akun.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Device" value={devices.length} />
        <Card title="Connected" value={devices.filter((d) => d.status === "CONNECTED").length} />
        <Card title="Disconnected" value={devices.filter((d) => d.status !== "CONNECTED").length} />
        <Card title="User Aktif" value={new Set(devices.map((d) => d.userId)).size} />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari username..."
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 outline-none focus:border-green-500"
        />
      </div>

      <div className="space-y-4">
        {filtered.map((d) => (
          <div key={d.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-black">{d.username}</h2>
                <p className="text-slate-400 text-sm">
                  Session: {d.sessionId}
                </p>
              </div>

              <span
                className={
                  d.status === "CONNECTED"
                    ? "bg-green-500/20 text-green-400 px-4 py-2 rounded-xl font-bold text-sm"
                    : "bg-red-500/20 text-red-400 px-4 py-2 rounded-xl font-bold text-sm"
                }
              >
                {d.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <Mini label="User ID" value={d.userId} />
              <Mini label="Role" value={d.role} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
      <p className="text-slate-400 text-sm">{title}</p>
      <h2 className="text-4xl font-black mt-3">{value}</h2>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <p className="text-slate-400 text-xs">{label}</p>
      <h3 className="text-lg font-black mt-1 break-words">{value}</h3>
    </div>
  );
}
