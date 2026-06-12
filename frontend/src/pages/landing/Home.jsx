import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <header className="max-w-6xl mx-auto px-5 py-6 flex items-center justify-between">
        <img src="/assets/logo.png" alt="SEWAWAPRO" className="h-12 w-auto" />

        <Link
          to="/login"
          className="bg-slate-800 hover:bg-slate-700 px-5 py-3 rounded-xl font-bold"
        >
          Login
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-14">
        <section className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-block bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-sm font-bold mb-6">
              WhatsApp Blast Platform
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              Kirim Blast WhatsApp Lebih Cepat & Profesional
            </h1>

            <p className="text-slate-400 text-lg mt-6">
              Hubungkan WhatsApp, upload target, atur kecepatan, dan pantau report dalam satu dashboard mobile-first.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                to="/register"
                className="bg-green-500 hover:bg-green-600 px-7 py-4 rounded-2xl font-black text-center"
              >
                Daftar Sekarang
              </Link>

              <Link
                to="/login"
                className="bg-slate-800 hover:bg-slate-700 px-7 py-4 rounded-2xl font-black text-center"
              >
                Masuk Dashboard
              </Link>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 shadow-2xl">
            <div className="grid grid-cols-2 gap-4">
              <Card title="Success" value="98%" />
              <Card title="Device" value="Multi" />
              <Card title="Delay" value="Smart" />
              <Card title="Report" value="Realtime" />
            </div>

            <div className="mt-6 bg-slate-800 rounded-3xl p-5">
              <p className="text-slate-400 text-sm mb-3">Blast Progress</p>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[78%]" />
              </div>
              <div className="flex justify-between text-sm text-slate-400 mt-3">
                <span>783 terkirim</span>
                <span>Realtime</span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-5 mt-16">
          <Feature title="Multi Device" text="Setiap akun bisa menghubungkan WhatsApp sendiri." />
          <Feature title="Upload Target" text="Upload TXT/CSV, nomor otomatis dibersihkan." />
          <Feature title="Stop Blast" text="Hentikan blast kapan saja dengan aman." />
        </section>
      </main>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-slate-800 rounded-3xl p-5">
      <p className="text-slate-400 text-sm">{title}</p>
      <h2 className="text-3xl font-black mt-2">{value}</h2>
    </div>
  );
}

function Feature({ title, text }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <div className="w-12 h-12 rounded-2xl bg-green-500/20 text-green-400 flex items-center justify-center mb-4">
        ✓
      </div>
      <h3 className="text-xl font-black mb-2">{title}</h3>
      <p className="text-slate-400">{text}</p>
    </div>
  );
}
