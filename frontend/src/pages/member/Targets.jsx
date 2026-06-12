import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Targets() {
  const [targets, setTargets] = useState([]);
  const [name, setName] = useState("");
  const [phones, setPhones] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  async function load() {
    try {
      const res = await api.get("/targets");
      setTargets(res.data.data || []);
    } catch {
      setTargets([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    if (!name) {
      alert("Nama target wajib diisi");
      return;
    }

    if (!phones) {
      alert("Nomor target wajib diisi");
      return;
    }

    try {
      setLoading(true);

      await api.post("/targets", {
        name,
        phones,
      });

      setName("");
      setPhones("");

      await load();

      alert("Target berhasil dibuat");
    } catch (e) {
      alert(e.response?.data?.message || "Gagal simpan target");
    } finally {
      setLoading(false);
    }
  }

  async function uploadFile(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!name) {
      alert("Isi nama target dulu sebelum upload");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("file", file);

      await api.post("/targets/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setName("");
      setPhones("");

      await load();

      alert("Upload target berhasil");
    } catch (e) {
      alert(e.response?.data?.message || "Gagal upload target");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  }

  async function remove(id) {
    if (!confirm("Hapus target ini? Report blast terkait juga akan ikut terhapus.")) {
      return;
    }

    try {
      await api.delete(`/targets/${id}`);
      await load();
    } catch (e) {
      alert(e.response?.data?.message || "Gagal hapus target");
    }
  }

  const filtered = targets.filter((x) =>
    String(x.name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPhones = targets.reduce((total, target) => {
    return total + String(target.phones || "").split(",").filter(Boolean).length;
  }, 0);

  return (
    <div className="space-y-5 pb-32 overflow-x-hidden">
      <div>
        <h1 className="text-3xl font-black text-white">Target Manager</h1>
        <p className="text-slate-400 mt-1">
          Kelola nomor tujuan blast
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
          <p className="text-slate-400 text-sm">Total Target</p>
          <h1 className="text-4xl font-black mt-2">{targets.length}</h1>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
          <p className="text-slate-400 text-sm">Total Nomor</p>
          <h1 className="text-4xl font-black mt-2">{totalPhones}</h1>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
        <h2 className="font-black text-xl">Tambah Target</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama target, contoh: Customer Hari Ini"
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 outline-none focus:border-green-500"
        />

        <textarea
          rows={7}
          value={phones}
          onChange={(e) => setPhones(e.target.value)}
          placeholder="Paste nomor manual: 628xxx, 628xxx atau pisah baris"
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 outline-none focus:border-green-500"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={create}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-slate-700 rounded-2xl p-4 font-black"
          >
            {loading ? "Menyimpan..." : "Simpan Manual"}
          </button>

          <label className="w-full">
            <div className="w-full bg-blue-500 hover:bg-blue-600 rounded-2xl p-4 font-black text-center cursor-pointer">
              Upload TXT/CSV
            </div>

            <input
              hidden
              type="file"
              accept=".txt,.csv"
              onChange={uploadFile}
            />
          </label>
        </div>

        <p className="text-slate-500 text-xs">
          Format nomor otomatis dibersihkan ke 628xxx. File TXT/CSV bisa berisi nomor per baris atau dipisah koma.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari target..."
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 outline-none focus:border-green-500"
        />
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-xl font-black">Belum ada target</h2>
            <p className="text-slate-400 text-sm mt-2">
              Buat target manual atau upload file TXT/CSV.
            </p>
          </div>
        ) : (
          filtered.map((t) => {
            const count = String(t.phones || "").split(",").filter(Boolean).length;

            return (
              <div
                key={t.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-black text-xl break-words">
                      {t.name}
                    </h3>

                    <p className="text-slate-400 text-sm mt-1">
                      {count} nomor
                    </p>
                  </div>

                  <button
                    onClick={() => remove(t.id)}
                    className="shrink-0 bg-red-500 hover:bg-red-600 px-4 py-3 rounded-xl font-bold text-sm"
                  >
                    Hapus
                  </button>
                </div>

                <div className="mt-4 max-h-[180px] overflow-auto bg-slate-800 rounded-2xl p-3 text-sm text-slate-300 break-words">
                  {t.phones}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
