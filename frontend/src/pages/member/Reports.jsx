import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Reports() {
  const [reports, setReports] = useState([]);

  async function load() {
    try {
      const res = await api.get("/reports");
      setReports(res.data.data || []);
    } catch {
      setReports([]);
    }
  }

  useEffect(() => {
    load();
    const timer = setInterval(load, 4000);
    return () => clearInterval(timer);
  }, []);

  const total = reports.length;
  const success = reports.reduce((a, b) => a + (b.success || 0), 0);
  const failed = reports.reduce((a, b) => a + (b.failed || 0), 0);
  const completed = reports.filter((x) => x.status === "COMPLETED").length;

  return (
    <div className="space-y-5 pb-32">
      <div>
        <h1 className="text-3xl font-black">Reports</h1>
        <p className="text-slate-400">Riwayat dan statistik blast</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card title="Total Blast" value={total} />
        <Card title="Success" value={success} />
        <Card title="Failed" value={failed} />
        <Card title="Completed" value={completed} />
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="bg-slate-900 rounded-3xl p-8 text-center">
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-xl font-black">Belum ada report</h2>
            <p className="text-slate-400 text-sm mt-2">
              Riwayat blast akan muncul setelah kamu mulai blast.
            </p>
          </div>
        ) : (
          reports.map((r) => (
            <div key={r.id} className="bg-slate-900 rounded-3xl p-5">
              <div className="flex justify-between gap-3 mb-4">
                <div>
                  <h2 className="font-black text-lg">Blast #{r.id}</h2>
                  <p className="text-slate-400 text-sm">
                    Template: {r.template?.title || "-"}
                  </p>
                  <p className="text-slate-400 text-sm">
                    Target: {r.target?.name || "-"}
                  </p>
                </div>

                <Status status={r.status} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Mini title="Total" value={r.total || 0} />
                <Mini title="Success" value={r.success || 0} />
                <Mini title="Failed" value={r.failed || 0} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-slate-900 rounded-3xl p-5">
      <p className="text-slate-400 text-sm">{title}</p>
      <h2 className="text-4xl font-black mt-2">{value}</h2>
    </div>
  );
}

function Mini({ title, value }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-4 text-center">
      <p className="text-slate-400 text-xs">{title}</p>
      <h3 className="text-xl font-black">{value}</h3>
    </div>
  );
}

function Status({ status }) {
  const color =
    status === "COMPLETED"
      ? "bg-green-500/20 text-green-400"
      : status === "RUNNING"
      ? "bg-yellow-500/20 text-yellow-400"
      : "bg-red-500/20 text-red-400";

  return (
    <span className={`h-fit px-3 py-2 rounded-full text-xs font-black ${color}`}>
      {status || "UNKNOWN"}
    </span>
  );
}
