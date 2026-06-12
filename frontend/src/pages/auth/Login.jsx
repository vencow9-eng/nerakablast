import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        username,
        password,
      });

      const token = res.data?.data?.token;

      if (!token) {
        alert("Token tidak ditemukan");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Login gagal");
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
            <h1 className="text-2xl font-black">SEWAWAPRO</h1>
            <p className="text-green-400 text-sm">WhatsApp Blast Platform</p>
          </div>
        </div>

        <div>
          <h2 className="text-5xl font-black leading-tight mb-6">
            Blast lebih cepat, <br />
            <span className="text-green-400">lebih pintar.</span>
          </h2>

          <p className="text-slate-400 text-lg max-w-lg mb-10">
            Platform WhatsApp blast profesional dengan sistem multi-device,
            realtime report, dan manajemen target yang mudah digunakan.
          </p>

          <div className="space-y-5">
            <Feature title="Blast Cepat" text="Kirim pesan WhatsApp otomatis." />
            <Feature title="Multi Device" text="Hubungkan banyak akun WhatsApp." />
            <Feature title="Realtime Report" text="Pantau success dan failed langsung." />
          </div>
        </div>

        <p className="text-slate-500 text-sm">
          © 2026 SEWAWAPRO
        </p>
      </div>

      <div className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 lg:hidden">
            <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center font-black text-3xl mb-5">
              S
            </div>
            <h1 className="text-4xl font-black">SEWAWAPRO</h1>
          </div>

          <h2 className="text-3xl font-black mb-2">
            Masuk ke akun
          </h2>

          <p className="text-slate-400 mb-8">
            Belum punya akun?{" "}
            <Link to="/register" className="text-green-400 font-bold">
              Daftar sekarang
            </Link>
          </p>

          <form onSubmit={login} className="space-y-5">
            <div>
              <label className="block text-sm font-bold mb-2">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username kamu"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-4 outline-none focus:border-green-500"
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
                placeholder="password"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-4 outline-none focus:border-green-500"
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 rounded-xl p-4 font-black shadow-lg shadow-green-500/20"
            >
              {loading ? "Masuk..." : "Masuk"}
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
        ⚡
      </div>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-slate-400 text-sm">{text}</p>
      </div>
    </div>
  );
}
