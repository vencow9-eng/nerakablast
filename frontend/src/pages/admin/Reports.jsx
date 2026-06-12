import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminReports() {
  const [reports, setReports] = useState([]);

  async function load() {
    try {
      const res = await api.get("/reports/admin/all");
      setReports(res.data.data || []);
    } catch (e) {
      alert(e.response?.data?.message || "Gagal load reports");
    }
  }

  function exportCSV() {
    const rows = [
      [
        "Blast Code",
        "Owner",
        "Template",
        "Target",
        "Total",
        "Success",
        "Failed",
        "Status",
        "Created At",
      ],
      ...reports.map((r) => [
        `BLAST-${String(r.id).padStart(6, "0")}`,
        r.user?.username || "-",
        r.template?.title || "-",
        r.target?.name || "-",
        r.total || 0,
        r.success || 0,
        r.failed || 0,
        r.status || "-",
        formatDate(r.createdAt),
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `sewawapro-admin-reports-${Date.now()}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    load();

    const timer = setInterval(load, 5000);

    return () => clearInterval(timer);
  }, []);

  const totalSuccess = reports.reduce((a, r) => a + (r.success || 0), 0);
  const totalFailed = reports.reduce((a, r) => a + (r.failed || 0), 0);
  const totalSent = totalSuccess + totalFailed;
  const successRate =
    totalSent > 0 ? Math.round((totalSuccess / totalSent) * 100) : 0;

  return (
    <div className="space-y-6 pb-28 overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black">
            Admin Reports
          </h1>

          <p className="text-slate-400 mt-2">
            Monitoring semua campaign blast dari seluruh akun.
          </p>
        </div>

        <button
          onClick={exportCSV}
          disabled={reports.length === 0}
          className="bg-green-500 hover:bg-green-600 disabled:bg-slate-700 disabled:text-slate-400 rounded-2xl px-5 py-4 font-black"
        >
          ⬇ Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Campaign" value={reports.length} />
        <Card title="Success" value={totalSuccess} />
        <Card title="Failed" value={totalFailed} />
        <Card title="Success Rate" value={`${successRate}%`} />
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center">
            <h2 className="text-xl font-black">
              Belum ada campaign
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              Data akan muncul setelah user menjalankan blast.
            </p>
          </div>
        ) : (
          reports.map((r) => (
            <div
              key={r.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5"
            >
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                <div className="space-y-4 w-full">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-black tracking-wide">
                      BLAST-{String(r.id).padStart(6, "0")}
                    </h2>

                    <StatusBadge status={r.status} />
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    <InfoBox
                      label="OWNER"
                      value={r.user?.username || "-"}
                    />

                    <InfoBox
                      label="TARGET"
                      value={r.target?.name || "-"}
                    />

                    <InfoBox
                      label="TEMPLATE"
                      value={r.template?.title || "-"}
                    />

                    <InfoBox
                      label="CREATED"
                      value={formatDate(r.createdAt)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-5">
                <Mini label="Total" value={r.total || 0} />
                <Mini label="Success" value={r.success || 0} />
                <Mini label="Failed" value={r.failed || 0} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
}

function StatusBadge({ status }) {
  const cls =
    status === "COMPLETED"
      ? "bg-green-500/10 text-green-400 border-green-500/30"
      : status === "RUNNING"
      ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
      : status === "STOPPED"
      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
      : status === "PENDING"
      ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
      : "bg-red-500/10 text-red-400 border-red-500/30";

  return (
    <span className={`px-4 py-2 rounded-xl border font-black text-sm ${cls}`}>
      {status || "UNKNOWN"}
    </span>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-slate-800 rounded-xl px-4 py-3 min-w-0">
      <p className="text-slate-500 text-xs font-bold">
        {label}
      </p>

      <p className="font-semibold mt-1 truncate">
        {value}
      </p>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
      <p className="text-slate-400 text-sm">
        {title}
      </p>

      <h2 className="text-4xl font-black mt-3">
        {value}
      </h2>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <p className="text-slate-400 text-xs">
        {label}
      </p>

      <h3 className="text-2xl font-black mt-1">
        {value}
      </h3>
    </div>
  );
}
