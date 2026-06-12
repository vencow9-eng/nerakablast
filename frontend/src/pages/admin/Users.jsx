import { useEffect, useState } from "react";
import api from "../../services/api";

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
      <div>
        <h1 className="text-3xl md:text-5xl font-black">Users</h1>
        <p className="text-slate-400 mt-2">
          Pantau semua akun, device WhatsApp, dan aktivitas blast.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total User" value={users.length} />
        <Card
          title="Member"
          value={users.filter((u) => u.role === "MEMBER").length}
        />
        <Card
          title="Admin"
          value={users.filter((u) => u.role === "ADMIN").length}
        />
        <Card
          title="WA Connected"
          value={users.reduce((a, u) => a + (u.connectedDevice || 0), 0)}
        />
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
        {filtered.map((u) => (
          <div
            key={u.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-black">{u.username}</h2>
                <p className="text-slate-400 text-sm">
                  Role: {u.role} • Status: {u.isActive ? "ACTIVE" : "NONACTIVE"}
                </p>
              </div>

              <Badge text={u.role} />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-5">
              <Mini label="Device" value={u.totalDevice || 0} />
              <Mini label="Connected" value={u.connectedDevice || 0} />
              <Mini label="Blast" value={u.totalBlast || 0} />
              <Mini label="Success" value={u.totalSuccess || 0} />
              <Mini label="Failed" value={u.totalFailed || 0} />
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
      <h3 className="text-2xl font-black mt-1">{value}</h3>
    </div>
  );
}

function Badge({ text }) {
  return (
    <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl font-bold text-sm">
      {text}
    </span>
  );
}
