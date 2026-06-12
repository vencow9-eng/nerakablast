import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Dashboard() {
  const [data, setData] = useState(null);

  async function load() {
    try {
      const res = await api.get("/dashboard/member")
      setData(res.data.data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-3xl md:text-5xl font-black">Dashboard</h1>
        <p className="text-slate-400 mt-2">
          Pantau aktivitas SEWAWAPRO kamu secara realtime
        </p>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 text-yellow-300 text-sm">
        📢 Pastikan WhatsApp sudah connected sebelum mulai blast.
      </div>

      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-3xl p-5 flex items-center justify-between">
        <div>
          <h2 className="font-black text-lg">Mulai Blast Sekarang</h2>
          <p className="text-slate-400 text-sm">
            Buat target, pilih template, lalu jalankan blast
          </p>
        </div>
        <a
          href="/blast"
          className="bg-green-500 px-4 py-3 rounded-xl font-bold"
        >
          Gas →
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total User" value={data?.totalUser || 0} icon="👤" />
        <Card title="Total Staff" value={data?.totalStaff || 0} icon="🧑‍💼" />
        <Card title="Total Blast" value={data?.totalBlast || 0} icon="🚀" />
        <Card title="Total Device" value={data?.totalDevice || 0} icon="📱" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="Blast Activity">
          <Row label="Success" value="98%" color="text-green-400" />
          <Row label="Failed" value="2%" color="text-red-400" />
          <Row label="Connected" value={data?.totalDevice || 0} color="text-green-400" />
        </Panel>

        <Panel title="Server Status">
          <Row label="Backend" value="ONLINE" color="text-green-400" />
          <Row label="Redis" value="ONLINE" color="text-green-400" />
          <Row label="Queue" value="RUNNING" color="text-green-400" />
        </Panel>
      </div>
    </div>
  );
}

function Card({ title, value, icon }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
      <div className="flex justify-between items-center mb-5">
        <p className="text-slate-400 text-sm">{title}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <h2 className="text-4xl font-black">{value}</h2>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
      <h2 className="text-xl font-black mb-5">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, value, color }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-4 flex justify-between">
      <span>{label}</span>
      <strong className={color}>{value}</strong>
    </div>
  );
}
