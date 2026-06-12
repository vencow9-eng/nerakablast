import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export default function Register() {
  const navigate = useNavigate();
  const { staffUsername } = useParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function register(e) {
    e.preventDefault();

    if (!username) {
      alert("Username wajib diisi");
      return;
    }

    if (!password) {
      alert("Password wajib diisi");
      return;
    }

    if (password !== confirm) {
      alert("Konfirmasi password tidak sama");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        username,
        password,
        staffUsername: staffUsername || null,
      });

      alert("Daftar berhasil, silakan login");
      navigate("/", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Daftar gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center font-black text-2xl">
            S
          </div>

          <div>
            <h1 className="text-2xl font-black">
              SEWAWAPRO
            </h1>
            <p className="text-green-400 text-sm">
              WhatsApp Blast Platform
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-5xl font-black leading-tight mb-6">
            Mulai blast WhatsApp <br />
            <span className="text-green-400">
              lebih profesional.
            </span>
          </h2>

          <p className="text-slate-400 text-lg max-w-lg mb-10">
            Daftar akun, hubungkan WhatsApp, pilih kecepatan blast,
            dan pantau laporan secara realtime.
          </p>

          <div className="space-y-5">
            <Feature title="Multi Akun" text="Setiap user punya dashboard sendiri." />
            <Feature title="Multi Device" text="Hubungkan WhatsApp sesuai akun." />
            <Feature title="Staff Referral" text="Daftar melalui link staff otomatis tercatat." />
          </div>
        </div>

        <p className="text-slate-500 text-sm">
          © 2026 SEWAWAPRO
        </p>
      </div>

      <div className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-[440px]">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center font-black text-3xl mb-5">
              S
            </div>

            <h2 className="text-3xl font-black mb-2">
              Buat akun baru
            </h2>

            <p className="text-slate-400">
              Sudah punya akun?{" "}
              <Link to="/" className="text-green-400 font-bold">
                Masuk di sini
              </Link>
            </p>

            {staffUsername && (
              <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
                <p className="text-green-400 text-sm font-bold">
                  Daftar melalui staff: {staffUsername}
                </p>
              </div>
            )}
          </div>

          <form
            onSubmit={register}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-7 space-y-5"
          >
            <div>
              <label className="block text-sm font-bold mb-2">
                Username
              </label>

              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username kamu"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-4 outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="minimal 6 karakter"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-4 outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Konfirmasi Password
              </label>

              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="ulangi password"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-4 outline-none focus:border-green-500"
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-slate-700 rounded-xl p-4 font-black shadow-lg shadow-green-500/20"
            >
              {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, text }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center">
        ✓
      </div>
      <div>
        <h3 className="font-bold">
          {title}
        </h3>
        <p className="text-slate-400 text-sm">
          {text}
        </p>
      </div>
    </div>
  );
}
