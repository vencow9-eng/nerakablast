import { useEffect, useState } from "react";
import api from "../../services/api";
import { AppCard, AppBadge, PageHeader } from "../../components/ui";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  async function load() {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data || []);
    } catch (e) {
      alert(e.response?.data?.message || "Gagal load users");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = users.filter((u) =>
    String(u.username || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-28">
      <PageHeader
        title="Users"
        subtitle="Pantau semua akun, device WhatsApp, dan aktivitas blast."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat title="Total User" value={users.length} />
        <Stat title="Member" value={users.filter((u) => u.role === "MEMBER").length} />
        <Stat title="Admin" value={users.filter((u) => u.role === "ADMIN").length} />
        <Stat title="WA Connected" value={users.reduce((a, u) => a + (u.connectedDevice || 0), 0)} />
      </div>

      <AppCard>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari username..."
        />
      </AppCard>

      <div className="space-y-4">
        {filtered.map((u) => (
          <AppCard key={u.id}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-black">{u.username}</h2>
                <p className="text-slate-400 text-sm">
                  Role: {u.role} • Status: {u.isActive ? "ACTIVE" : "NONACTIVE"}
                </p>
              </div>

              <AppBadge variant="success">{u.role}</AppBadge>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-5">
              <Mini label="Device" value={u.totalDevice || 0} />
              <Mini label="Connected" value={u.connectedDevice || 0} />
              <Mini label="Blast" value={u.totalBlast || 0} />
              <Mini label="Success" value={u.totalSuccess || 0} />
              <Mini label="Failed" value={u.totalFailed || 0} />
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
      <h3 className="text-2xl font-black mt-1">{value}</h3>
    </div>
  );
}
