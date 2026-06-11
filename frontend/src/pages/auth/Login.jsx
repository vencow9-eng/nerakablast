import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("nerakablast");
  const [password, setPassword] = useState("neraka717273");
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
      console.log(err);
      alert(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center">
      <div className="w-[430px] bg-slate-900 rounded-3xl p-10 border border-slate-800">
        <div className="mb-8">
          <div className="w-16 h-16 rounded-2xl bg-green-500 text-white font-black text-3xl flex items-center justify-center mb-6">
            N
          </div>

          <h1 className="text-4xl font-black text-white">
            NERAKABLAST
          </h1>
        </div>

        <form onSubmit={login} className="space-y-5">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full bg-slate-800 text-white rounded-xl p-4"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-slate-800 text-white rounded-xl p-4"
          />

          <button
            disabled={loading}
            className="w-full bg-green-500 rounded-xl p-4 font-bold"
          >
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}