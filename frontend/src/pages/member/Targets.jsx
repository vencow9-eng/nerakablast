import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Targets() {
  const [targets, setTargets] = useState([]);
  const [name, setName] = useState("");
  const [phones, setPhones] = useState("");

  async function load() {
    const res = await api.get("/targets");
    setTargets(res.data.data || []);
  }

  async function create() {
    await api.post("/targets", { name, phones });
    setName("");
    setPhones("");
    load();
  }

  async function remove(id) {
    await api.delete(`/targets/${id}`);
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1 style={{ color: "white" }}>Targets</h1>

      <div style={{ background: "white", padding: 30, borderRadius: 20 }}>
        <input placeholder="Nama target" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: 14 }} />

        <textarea placeholder="Nomor pisahkan koma: 628xxx,628xxx" value={phones} onChange={(e) => setPhones(e.target.value)} rows={5} style={{ width: "100%", padding: 14, marginTop: 12 }} />

        <button onClick={create} style={{ marginTop: 20, background: "#16a34a", color: "white", border: 0, padding: 14, borderRadius: 10 }}>
          Simpan
        </button>
      </div>

      <div style={{ marginTop: 30, display: "grid", gap: 16 }}>
        {targets.map((t) => (
          <div key={t.id} style={{ background: "white", padding: 24, borderRadius: 18 }}>
            <h3>{t.name}</h3>
            <p>{t.phones}</p>
            <button onClick={() => remove(t.id)} style={{ background: "#ef4444", color: "white", border: 0, padding: 10, borderRadius: 10 }}>
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}