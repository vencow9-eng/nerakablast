import { useEffect, useState } from "react";
import api from "../../services/api";

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

export default function Dashboard() {
  const user = getUser();
  const isAdmin = user.role === "ADMIN";

  const [data, setData] = useState(null);

  async function load() {
    try {
      const url = isAdmin ? "/dashboard/admin" : "/dashboard/member";
      const res = await api.get(url);
      setData(res.data.data);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    load();

    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, []);

  if (isAdmin) {
    return <AdminDashboard data={data} />;
  }

  return <MemberDashboard data={data} />;
}

function MemberDashboard({ data }) {
  return (
    <div className="space-y-6 pb-28">
      <div>
        <h1 className="text-3xl md:text-5xl font-black">Dashboard</h1>
        <p className="text-slate-400 mt-2">
          Ringkasan aktivitas blast kamu
        </p>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 text-yellow-300 text-sm">
        📢 Pastikan WhatsApp sudah connected sebelum mulai blast.
      </div>

      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-3xl p-5 flex items-center justify-between">
        <div>
          <h2 className="font-black text-lg">Mulai Blast Sekarang</h2>
          <p className="text-slate-400 text-sm">
            Connect WhatsApp, pilih speed, lalu jalankan blast
          </p>
        </div>

        <a href="/blast" className="bg-green-500 px-4 py-3 rounded-xl font-bold">
          Gas →
        </a>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card title="Total Blast" value={data?.totalBlastHariIni || 0} icon="🚀" />
        <Card title="WhatsApp" value={data?.whatsappConnected || 0} icon="📱" />
        <Card title="Success" value={data?.totalSuccess || 0} icon="✅" />
        <Card title="Failed" value={data?.totalFailed || 0} icon="❌" />
      </div>

      <Panel title="Status Sistem">
        <Row label="Backend" value="ONLINE" color="text-green-400" />
        <Row label="Queue" value="RUNNING" color="text-green-400" />
      </Panel>
    </div>
  );
}

function AdminDashboard({ data }) {
  const success = data?.success || 0;
  const failed = data?.failed || 0;
  const totalSent = data?.totalSent || success + failed;
  const successRate = totalSent > 0 ? Math.round((success / totalSent) * 100) : 0;

  return (
    <div className="space-y-6 pb-28">
      <div>
        <h1 className="text-3xl md:text-5xl font-black">Admin Dashboard</h1>
        <p className="text-slate-400 mt-2">
          Pantau semua user, device, blast, dan aktivitas sistem
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total User" value={data?.totalUser || 0} icon="👤" />
        <Card title="Member" value={data?.totalMember || 0} icon="🧑" />
        <Card title="Total Blast" value={data?.totalBlast || 0} icon="🚀" />
        <Card title="Device WA" value={data?.totalDevice || 0} icon="📱" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Connected WA" value={data?.connectedDevice || 0} icon="🟢" />
        <Card title="Running Blast" value={data?.runningBlast || 0} icon="⚡" />
        <Card title="Completed" value={data?.completedBlast || 0} icon="✅" />
        <Card title="Failed Blast" value={data?.failedBlast || 0} icon="❌" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Panel title="Global Blast Analytics">
          <Row label="Total Sent" value={totalSent} color="text-white" />
          <Row label="Success" value={success} color="text-green-400" />
          <Row label="Failed" value={failed} color="text-red-400" />
          <Row label="Success Rate" value={`${successRate}%`} color="text-green-400" />
        </Panel>

        <Panel title="Server Status">
          <Row label="Backend" value="ONLINE" color="text-green-400" />
          <Row label="Redis" value="ONLINE" color="text-green-400" />
          <Row label="Queue" value="RUNNING" color="text-green-400" />
          <Row label="Revenue" value={`Rp ${data?.totalRevenue || 0}`} color="text-yellow-400" />
        </Panel>
      </div>

      <Panel title="Recent Blast Semua Akun">
        <div className="space-y-3">
          {(data?.recentBlasts || []).length === 0 ? (
            <p className="text-slate-400 text-sm">Belum ada aktivitas blast.</p>
          ) : (
            data.recentBlasts.map((b) => (
              <div
                key={b.id}
                className="bg-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <h3 className="font-black">Blast #{b.id}</h3>
                  <p className="text-slate-400 text-sm">
                    User: {b.user} • Template: {b.template} • Target: {b.target}
                  </p>
                </div>

                <div className="flex gap-2 text-sm">
                  <Badge text={`Total ${b.total || 0}`} />
                  <Badge text={`S ${b.success || 0}`} color="green" />
                  <Badge text={`F ${b.failed || 0}`} color="red" />
                  <Badge text={b.status} color="blue" />
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>
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
    <div className="bg-slate-800 rounded-2xl p-4 flex justify-between gap-4">
      <span>{label}</span>
      <strong className={color}>{value}</strong>
    </div>
  );
}

function Badge({ text, color }) {
  const cls =
    color === "green"
      ? "bg-green-500/20 text-green-400"
      : color === "red"
      ? "bg-red-500/20 text-red-400"
      : color === "blue"
      ? "bg-blue-500/20 text-blue-400"
      : "bg-slate-700 text-slate-300";

  return (
    <span className={`px-3 py-2 rounded-xl font-bold ${cls}`}>
      {text}
    </span>
  );
}
