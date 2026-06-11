import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      const res = await api.get("/devices");
      setDevices(res.data.data || []);
    } catch (e) {
      console.log(e);
    }
  }

  async function addDevice() {
    setLoading(true);

    try {
      await api.post("/devices");
      await load();
    } catch {
      alert("Gagal tambah device");
    } finally {
      setLoading(false);
    }
  }

  async function connect(id) {
    try {
      await api.post(`/whatsapp/${id}/connect`);
      await load();
    } catch {
      alert("Gagal connect. Test WhatsApp real nanti di VPS.");
    }
  }

  async function reset(id) {
    try {
      await api.post(`/whatsapp/${id}/disconnect`);
      await load();
    } catch {
      alert("Gagal reset");
    }
  }

  async function remove(id) {
    if (!confirm("Hapus device ini?")) return;

    try {
      await api.delete(`/devices/${id}`);
      await load();
    } catch {
      alert("Gagal hapus");
    }
  }

  useEffect(() => {
    load();

    const timer = setInterval(load, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-5xl font-black mb-2">
            Akun WhatsApp
          </h1>

          <p className="text-slate-400">
            Kelola device WhatsApp kamu
          </p>
        </div>

        <button
          onClick={addDevice}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-bold"
        >
          {loading ? "Menambah..." : "+ Tambah Device"}
        </button>
      </div>

      {devices.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
          <div className="text-5xl mb-4">📱</div>
          <h2 className="text-2xl font-bold mb-2">
            Belum ada device
          </h2>
          <p className="text-slate-400">
            Klik tambah device untuk mulai menghubungkan WhatsApp.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {devices.map((d) => (
            <div
              key={d.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-2xl">
                  📱
                </div>

                <div>
                  <h3 className="text-xl font-bold">
                    Device #{d.id}
                  </h3>

                  <p className="text-slate-400 text-sm">
                    {d.sessionId}
                  </p>

                  <span
                    className={
                      d.status === "CONNECTED"
                        ? "inline-block mt-3 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-bold"
                        : d.status === "CONNECTING"
                        ? "inline-block mt-3 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-bold"
                        : "inline-block mt-3 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-bold"
                    }
                  >
                    {d.status}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => connect(d.id)}
                  className="bg-green-500 hover:bg-green-600 px-5 py-3 rounded-xl font-bold"
                >
                  Hubungkan
                </button>

                <button
                  onClick={() => reset(d.id)}
                  className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-xl font-bold"
                >
                  Reset
                </button>

                <button
                  onClick={() => remove(d.id)}
                  className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl font-bold"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}