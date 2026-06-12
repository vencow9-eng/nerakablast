import { useEffect, useState } from "react";
import api from "../../services/api";
import { AppCard, AppButton, AppBadge, PageHeader } from "../../components/ui";

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
      ["Blast Code", "Owner", "Template", "Target", "Total", "Success", "Failed", "Status", "Created At"],
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
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
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
  const successRate = totalSent > 0 ? Math.round((totalSuccess / totalSent) * 100) : 0;

  return (
    <div className="space-y-6 pb-28 overflow-x-hidden">
      <PageHeader
        title="Admin Reports"
        subtitle="Monitoring semua campaign blast dari seluruh akun."
        action={
          <AppButton onClick={exportCSV} disabled={reports.length === 0}>
            ⬇ Export CSV
          </AppButton>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat title="Total Campaign" value={reports.length} />
        <Stat title="Success" value={totalSuccess} />
        <Stat title="Failed" value={totalFailed} />
        <Stat title="Success Rate" value={`${successRate}%`} />
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <AppCard className="text-center p-8">
            <h2 className="text-xl font-black">Belum ada campaign</h2>
            <p className="text-slate-400 text-sm mt-2">
              Data akan muncul setelah user menjalankan blast.
            </p>
          </AppCard>
        ) : (
          reports.map((r) => (
            <AppCard key={r.id}>
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                <div className="space-y-4 w-full">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-black tracking-wide">
                      BLAST-{String(r.id).padStart(6, "0")}
                    </h2>

                    <AppBadge variant={badgeVariant(r.status)}>
                      {r.status || "UNKNOWN"}
                    </AppBadge>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    <Info label="OWNER" value={r.user?.username || "-"} />
                    <Info label="TARGET" value={r.target?.name || "-"} />
                    <Info label="TEMPLATE" value={r.template?.title || "-"} />
                    <Info label="CREATED" value={formatDate(r.createdAt)} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-5">
                <Mini label="Total" value={r.total || 0} />
                <Mini label="Success" value={r.success || 0} />
                <Mini label="Failed" value={r.failed || 0} />
              </div>
            </AppCard>
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

function badgeVariant(status) {
  if (status === "COMPLETED") return "success";
  if (status === "FAILED") return "danger";
  if (status === "STOPPED") return "warning";
  return "default";
}

function Stat({ title, value }) {
  return (
    <AppCard>
      <p className="text-slate-400 text-sm">{title}</p>
      <h2 className="text-4xl font-black mt-3">{value}</h2>
    </AppCard>
  );
}

function Info({ label, value }) {
  return (
    <div className="bg-slate-800 rounded-xl px-4 py-3 min-w-0">
      <p className="text-slate-500 text-xs font-bold">{label}</p>
      <p className="font-semibold mt-1 truncate">{value}</p>
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
