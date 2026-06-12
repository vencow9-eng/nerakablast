import { useEffect, useState } from "react";
import api from "../../services/api";
import { AppCard, AppButton, PageHeader } from "../../components/ui";

export default function Blast() {
  const [templates, setTemplates] = useState([]);
  const [targets, setTargets] = useState([]);
  const [templateId, setTemplateId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [speed, setSpeed] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [runningId, setRunningId] = useState(null);

  const speedOptions = [
    { value: "slow", label: "Slow", desc: "Lebih aman, jeda panjang" },
    { value: "medium", label: "Medium", desc: "Rekomendasi standar" },
    { value: "fast", label: "Fast", desc: "Lebih cepat" },
    { value: "very_fast", label: "Very Fast", desc: "Cepat, risiko lebih tinggi" },
  ];

  async function load() {
    try {
      const t = await api.get("/templates");
      const g = await api.get("/targets");
      const r = await api.get("/reports");

      const templateData = t.data.data || [];
      const targetData = g.data.data || [];
      const reportData = r.data.data || [];

      setTemplates(templateData);
      setTargets(targetData);

      if (templateData.length > 0 && !templateId) {
        setTemplateId(String(templateData[0].id));
      }

      if (targetData.length > 0 && !targetId) {
        setTargetId(String(targetData[0].id));
      }

      const running = reportData.find(
        (x) => x.status === "RUNNING" || x.status === "PENDING"
      );

      setRunningId(running ? running.id : null);
    } catch (e) {
      console.log(e);
    }
  }

  async function start() {
    if (!templateId || !targetId) {
      alert("Template atau target belum disiapkan admin");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/blasts/start", {
        templateId: Number(templateId),
        targetId: Number(targetId),
        speed,
      });

      const blastId = res.data?.data?.blast?.id;

      if (blastId) {
        setRunningId(blastId);
      }

      alert("Blast dimulai");
      await load();
    } catch (e) {
      alert(e.response?.data?.message || "Gagal mulai blast");
    } finally {
      setLoading(false);
    }
  }

  async function stop() {
    if (!runningId) return;

    try {
      setLoading(true);

      await api.post(`/blasts/${runningId}/stop`);

      setRunningId(null);
      alert("Blast dihentikan");
      await load();
    } catch (e) {
      alert(e.response?.data?.message || "Gagal stop blast");
    } finally {
      setLoading(false);
    }
  }

  async function handleMainButton() {
    if (runningId) {
      await stop();
    } else {
      await start();
    }
  }

  useEffect(() => {
    load();

    const timer = setInterval(load, 4000);

    return () => clearInterval(timer);
  }, []);

  const ready = templates.length > 0 && targets.length > 0;

  return (
    <div className="space-y-6 pb-28 overflow-x-hidden">
      <PageHeader
        title="Blast"
        subtitle="Tekan tombol untuk menjalankan blast dari WhatsApp kamu"
      />

      <AppCard>
        <div
          className={
            runningId
              ? "bg-red-500/10 border border-red-500/30 rounded-2xl p-5"
              : "bg-green-500/10 border border-green-500/30 rounded-2xl p-5"
          }
        >
          <h2 className="text-xl font-black mb-2">
            {runningId ? "Blast Sedang Berjalan" : "Siap Mulai Blast"}
          </h2>

          <p className="text-slate-400 text-sm">
            {runningId
              ? "Tekan tombol Stop Blast untuk menghentikan pengiriman nomor berikutnya."
              : "Pastikan WhatsApp sudah CONNECTED sebelum menjalankan blast."}
          </p>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-bold mb-2">
            Kecepatan Blast
          </label>

          <select
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            disabled={!!runningId}
            className="disabled:opacity-60"
          >
            {speedOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label} - {s.desc}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleMainButton}
          disabled={loading || (!ready && !runningId)}
          className={
            runningId
              ? "w-full bg-red-500 hover:bg-red-600 disabled:bg-slate-700 disabled:text-slate-400 rounded-2xl p-5 font-black text-lg mt-5"
              : "w-full bg-green-500 hover:bg-green-600 disabled:bg-slate-700 disabled:text-slate-400 rounded-2xl p-5 font-black text-lg mt-5"
          }
        >
          {loading
            ? "Memproses..."
            : runningId
            ? "⛔ Stop Blast"
            : "🚀 Mulai Blast Sekarang"}
        </button>
      </AppCard>

      {!ready && (
        <AppCard className="bg-yellow-500/10 border-yellow-500/30">
          <h2 className="font-black text-lg text-yellow-300 mb-2">
            Blast belum siap
          </h2>

          <p className="text-yellow-200 text-sm">
            Template dan target belum tersedia. Hubungi admin untuk menyiapkan data blast.
          </p>
        </AppCard>
      )}
    </div>
  );
}
