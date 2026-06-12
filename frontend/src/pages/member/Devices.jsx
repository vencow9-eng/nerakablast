import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [qr, setQr] = useState({});
  const [modal, setModal] = useState(false);
  const [mode, setMode] = useState("menu");
  const [selected, setSelected] = useState(null);
  const [phone, setPhone] = useState("");
  const [pairingCode, setPairingCode] = useState("");
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
    try {
      setLoading(true);
      await api.post("/devices");
      await load();
    } catch (e) {
      alert(e.response?.data?.message || "Gagal tambah device");
    } finally {
      setLoading(false);
    }
  }

  function openModal(device) {
    setSelected(device);
    setMode("menu");
    setPhone("");
    setPairingCode("");
    setQr((prev) => ({ ...prev }));
    setModal(true);
  }

  async function scanQr() {
    if (!selected) return;

    try {
      setMode("qr");
      setLoading(true);

      await api.post(`/whatsapp/${selected.id}/connect`);

      let foundQr = null;

      for (let i = 0; i < 15; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const res = await api.get(`/whatsapp/${selected.id}/status`);
        foundQr = res.data?.data?.qr;

        if (foundQr) {
          setQr((prev) => ({
            ...prev,
            [selected.id]: foundQr,
          }));
          break;
        }

        if (res.data?.data?.status === "CONNECTED") {
          await load();
          break;
        }
      }

      await load();

      if (!foundQr) {
        console.log("QR belum muncul / device mungkin sudah connected");
      }
    } catch (e) {
      alert(e.response?.data?.message || "Gagal connect QR");
    } finally {
      setLoading(false);
    }
  }

  async function pairing() {
    if (!selected) return;

    const cleanPhone = String(phone).replace(/\D/g, "");

    if (!cleanPhone || cleanPhone.length < 10) {
      alert("Masukkan nomor WhatsApp valid. Contoh: 628123456789");
      return;
    }

    try {
      setLoading(true);
      setPairingCode("");

      await api.post(`/whatsapp/${selected.id}/connect`);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      const res = await api.post(`/whatsapp/${selected.id}/pairing`, {
        phone: cleanPhone,
      });

      setPairingCode(res.data?.data?.code || "");
      await load();
    } catch (e) {
      alert(e.response?.data?.message || "Gagal membuat kode pairing");
    } finally {
      setLoading(false);
    }
  }

  async function reset(id) {
    try {
      await api.post(`/whatsapp/${id}/disconnect`);

      setQr((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });

      await load();
    } catch (e) {
      alert(e.response?.data?.message || "Gagal reset");
    }
  }

  async function remove(id) {
    if (!confirm("Yakin hapus WhatsApp ini?")) return;

    try {
      await api.delete(`/devices/${id}`);
      await load();
    } catch (e) {
      alert(e.response?.data?.message || "Gagal hapus");
    }
  }

  useEffect(() => {
    load();
    const timer = setInterval(load, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 pb-28 overflow-x-hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-3xl sm:text-5xl font-black leading-tight">
            WhatsApp
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Kelola koneksi WhatsApp khusus akun kamu
          </p>
        </div>

        <button
          onClick={addDevice}
          disabled={loading}
          className="shrink-0 bg-green-500 hover:bg-green-600 px-4 py-3 rounded-2xl font-black text-sm"
        >
          + Device
        </button>
      </div>

      {devices.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center">
          <div className="text-5xl mb-4">📱</div>
          <h2 className="text-xl font-black">Belum ada WhatsApp</h2>
          <p className="text-slate-400 text-sm mt-2">
            Tambahkan device untuk mulai menggunakan WhatsApp blast.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {devices.map((d, index) => (
          <div
            key={d.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 overflow-hidden"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-500/20 text-green-400 flex items-center justify-center text-2xl shrink-0">
                📱
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-black text-lg">
                  {index === 0 ? "WhatsApp Utama" : `WhatsApp ${index + 1}`}
                </h3>

                <p className="text-slate-400 text-xs break-all mt-1">
                  Session: {d.sessionId}
                </p>

                <div className="mt-3">
                  <Status status={d.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
              <button
                onClick={() => openModal(d)}
                className="bg-green-500 hover:bg-green-600 py-3 rounded-xl font-bold text-sm"
              >
                Connect
              </button>

              <button
                onClick={() => reset(d.id)}
                className="bg-blue-500 hover:bg-blue-600 py-3 rounded-xl font-bold text-sm"
              >
                Reset
              </button>

              <button
                onClick={() => remove(d.id)}
                className="bg-red-500 hover:bg-red-600 py-3 rounded-xl font-bold text-sm"
              >
                Hapus
              </button>
            </div>

            {qr[d.id] && (
              <div className="mt-5 bg-white p-3 rounded-2xl w-full max-w-[260px] mx-auto">
                <img
                  src={qr[d.id]}
                  alt="QR WhatsApp"
                  className="w-full aspect-square object-contain"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {modal && selected && (
        <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-[440px] bg-slate-900 border border-slate-800 rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 mb-6">
              <div>
                <h2 className="text-2xl font-black">
                  Hubungkan WhatsApp
                </h2>
                <p className="text-slate-400 text-sm">
                  WhatsApp ini hanya untuk akun kamu
                </p>
              </div>

              <button
                onClick={() => setModal(false)}
                className="w-10 h-10 rounded-xl bg-slate-800"
              >
                ✕
              </button>
            </div>

            {mode === "menu" && (
              <div className="space-y-4">
                <button
                  onClick={scanQr}
                  className="w-full text-left bg-green-500 hover:bg-green-600 rounded-2xl p-5"
                >
                  <div className="font-black text-lg">Scan QR</div>
                  <div className="text-green-100 text-sm">
                    Scan dari WhatsApp → Perangkat tertaut
                  </div>
                </button>

                <button
                  onClick={() => setMode("pairing")}
                  className="w-full text-left bg-slate-800 hover:bg-slate-700 rounded-2xl p-5"
                >
                  <div className="font-black text-lg">Pairing Code</div>
                  <div className="text-slate-400 text-sm">
                    Masukkan nomor WhatsApp lalu ambil kode pairing
                  </div>
                </button>
              </div>
            )}

            {mode === "qr" && (
              <div className="text-center">
                {loading ? (
                  <div className="py-10">
                    <div className="text-4xl mb-4">⏳</div>
                    <p className="text-slate-400 text-sm">
                      Mengambil QR WhatsApp...
                    </p>
                  </div>
                ) : qr[selected.id] ? (
                  <>
                    <div className="bg-white p-4 rounded-2xl w-full max-w-[260px] mx-auto">
                      <img
                        src={qr[selected.id]}
                        alt="QR WhatsApp"
                        className="w-full aspect-square object-contain"
                      />
                    </div>

                    <p className="text-slate-400 text-sm mt-4">
                      Scan dari WhatsApp → Perangkat tertaut
                    </p>
                  </>
                ) : selected.status === "CONNECTED" ? (
                  <div className="py-8">
                    <div className="text-5xl mb-4">✅</div>
                    <p className="font-black text-green-400">
                      WhatsApp sudah terhubung
                    </p>
                  </div>
                ) : (
                  <div className="py-8">
                    <p className="text-slate-400 text-sm">
                      QR belum tersedia. Tekan kembali lalu klik Scan QR lagi.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setMode("menu")}
                  className="mt-5 bg-slate-800 px-4 py-3 rounded-xl font-bold"
                >
                  Kembali
                </button>
              </div>
            )}

            {mode === "pairing" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold">
                    Nomor WhatsApp
                  </label>

                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="628123456789"
                    className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl p-4 outline-none focus:border-green-500"
                  />

                  <p className="text-slate-500 text-xs mt-2">
                    Gunakan format Indonesia: 628xxxx, tanpa + dan tanpa spasi.
                  </p>
                </div>

                <button
                  onClick={pairing}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 rounded-xl p-4 font-black"
                >
                  {loading ? "Memproses..." : "Ambil Kode Pairing"}
                </button>

                {pairingCode && (
                  <div className="bg-slate-950 border border-green-500/40 rounded-2xl p-5 text-center">
                    <p className="text-slate-400 text-sm mb-2">
                      Kode Pairing
                    </p>

                    <div className="text-4xl font-black tracking-widest text-green-400">
                      {pairingCode}
                    </div>

                    <p className="text-slate-500 text-xs mt-3">
                      Masukkan kode ini di WhatsApp → Perangkat tertaut → Tautkan dengan nomor telepon.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setMode("menu")}
                  className="w-full bg-slate-800 rounded-xl p-3 font-bold"
                >
                  Kembali
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Status({ status }) {
  const cls =
    status === "CONNECTED"
      ? "bg-green-500/20 text-green-400"
      : status === "CONNECTING"
      ? "bg-yellow-500/20 text-yellow-400"
      : "bg-red-500/20 text-red-400";

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${cls}`}>
      {status || "DISCONNECTED"}
    </span>
  );
}
