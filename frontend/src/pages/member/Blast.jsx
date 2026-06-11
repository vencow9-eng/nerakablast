import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Blast() {
  const [templates, setTemplates] = useState([]);
  const [targets, setTargets] = useState([]);
  const [templateId, setTemplateId] = useState("");
  const [targetId, setTargetId] = useState("");

  async function load() {
    const t = await api.get("/templates");
    const g = await api.get("/targets");

    setTemplates(t.data.data || []);
    setTargets(g.data.data || []);

    if (t.data.data?.[0]) setTemplateId(t.data.data[0].id);
    if (g.data.data?.[0]) setTargetId(g.data.data[0].id);
  }

  async function start() {
    await api.post("/blasts/start", {
      templateId: Number(templateId),
      targetId: Number(targetId),
    });

    alert("Blast dimulai");
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1 style={{ color: "white" }}>Blast</h1>

      <div style={{ background: "white", padding: 30, borderRadius: 20 }}>
        <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} style={{ width: "100%", padding: 14 }}>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>{t.title}</option>
          ))}
        </select>

        <select value={targetId} onChange={(e) => setTargetId(e.target.value)} style={{ width: "100%", padding: 14, marginTop: 12 }}>
          {targets.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <button onClick={start} style={{ marginTop: 20, background: "#16a34a", color: "white", border: 0, padding: 14, borderRadius: 10 }}>
          Mulai Blast
        </button>
      </div>
    </div>
  );
}