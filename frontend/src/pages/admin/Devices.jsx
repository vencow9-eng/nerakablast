import { useEffect, useState } from "react";
import api from "../../services/api";
import { AppCard, AppBadge, PageHeader } from "../../components/ui";

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
      <PageHeader
        title="Admin Devices"
        subtitle="Pantau semua WhatsApp yang terhubung per akun."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat title="Total Device" value={devices.length} />
        <Stat title="Connected" value={devices.filter((d) => d.status === "CONNECTED").length} />
        <Stat title="Disconnected" value={devices.filter((d) => d.status !== "CONNECTED").length} />
        <Stat title="User Aktif" value={new Set(devices.map((d) => d.userId)).size} />
      </div>

      <AppCard>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari username..."
        />
      </AppCard>

      <div className="space-y-4">
        {filtered.map((d) => (
          <AppCard key={d.id}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-black">{d.username}</h2>
                <p className="text-slate-400 text-sm">
                  Session: {d.sessionId}
                </p>
              </div>

              <AppBadge variant={d.status === "CONNECTED" ? "success" : "danger"}>
                {d.status}
              </AppBadge>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <Mini label="User ID" value={d.userId} />
              <Mini label="Role" value={d.role} />
            </div>
          </AppCard>
        ))}
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <AppCard>
      <p className="text-slate-400 text-sm">{title}</p>
      <h2 className="text-4xl font-black mt-3">{value}</h2>
    </AppCard>
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
