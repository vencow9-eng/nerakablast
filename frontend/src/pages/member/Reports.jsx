import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);

  async function load() {
    try {
      const s = await api.get("/reports/stats");
      const r = await api.get("/reports");

      setStats(s.data.data);
      setReports(r.data.data || []);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-5xl font-black mb-2">Reports</h1>
        <p className="text-slate-400">Riwayat dan statistik blast</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
        <Card title="Total Blast" value={stats?.totalBlast || 0} />
        <Card title="Success" value={stats?.success || 0} />
        <Card title="Failed" value={stats?.failed || 0} />
        <Card title="Completed" value={stats?.completed || 0} />
      </div>

      <div className="grid gap-5">
        {reports.map((r) => (
          <div
            key={r.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between"
          >
            <div>
              <h3 className="text-xl font-bold">Blast #{r.id}</h3>
              <p className="text-slate-400">
                Template: {r.template?.title || "-"}
              </p>
              <p className="text-slate-400">
                Target: {r.target?.name || "-"}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-block px-4 py-2 rounded-full bg-green-500/20 text-green-400 font-bold">
                {r.status}
              </span>

              <p className="mt-3 text-slate-300">
                Total {r.total} | Success {r.success} | Failed {r.failed}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <p className="text-slate-400">{title}</p>
      <h2 className="text-4xl font-black mt-3">{value}</h2>
    </div>
  );
}