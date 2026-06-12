import { Outlet, Link, useLocation } from "react-router-dom";

export default function DashboardLayout() {
  const location = useLocation();

  const token = localStorage.getItem("token");

  let user = {
    username: "member",
    role: "MEMBER",
  };

  try {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));

      user = {
        username: payload.username || payload.name || "member",
        role: payload.role || "MEMBER",
      };
    }
  } catch (e) {
    user = {
      username: "member",
      role: "MEMBER",
    };
  }

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

const allMenus = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠", roles: ["ADMIN", "STAFF", "MEMBER"] },
  { to: "/whatsapp", label: "WhatsApp", icon: "📱", roles: ["ADMIN", "STAFF", "MEMBER"] },
  { to: "/templates", label: "Templates", icon: "📝", roles: ["ADMIN", "STAFF"] },
  { to: "/targets", label: "Targets", icon: "🎯", roles: ["ADMIN", "STAFF"] },
  { to: "/blast", label: "Blast", icon: "🚀", roles: ["ADMIN", "STAFF", "MEMBER"] },
  { to: "/reports", label: "Reports", icon: "📊", roles: ["ADMIN", "STAFF", "MEMBER"] },
];

const menus = allMenus.filter((m) => m.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[260px] bg-slate-900 border-r border-slate-800 flex-col">
<div className="p-5 border-b border-slate-800 flex items-center justify-center">
  <img
    src="/assets/logo-sewa-wa.png"
    alt="SEWAWAPRO"
    className="h-16 w-auto max-w-[210px] object-contain"
  />
</div>

        <nav className="flex flex-col gap-2 px-4 py-6">
          {menus.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className={`p-3 rounded-xl ${
                location.pathname === m.to
                  ? "bg-slate-800 text-green-400"
                  : "hover:bg-slate-800"
              }`}
            >
              {m.icon} {m.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-5">
          <div className="bg-slate-800 p-4 rounded-2xl mb-4">
            <div className="font-bold">
              {user.username}
            </div>
            <div className="text-slate-400 text-sm">
              {user.role}
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>

      <section className="lg:ml-[260px] min-h-screen">
        <header className="sticky top-0 z-30 h-[70px] bg-slate-950/95 backdrop-blur border-b border-slate-800 flex items-center justify-between px-5 lg:px-10">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center font-black">
              S
            </div>

            <div>
              <h1 className="font-black text-lg">
                SEWAWAPRO
              </h1>
              <p className="text-xs text-slate-400">
                {user.username}
              </p>
            </div>
          </div>

          <h2 className="hidden lg:block text-2xl font-bold">
            Dashboard
          </h2>

          <Link
            to="/blast"
            className="bg-green-500 hover:bg-green-600 px-4 py-3 rounded-xl font-bold text-sm"
          >
            + Blast
          </Link>
        </header>

        <main className="p-5 lg:p-10 pb-28 overflow-x-hidden">
          <Outlet />
        </main>
      </section>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 grid grid-cols-5 px-2 py-2">
        {menus.slice(0, 5).map((m) => (
          <Link
            key={m.to}
            to={m.to}
            className={`flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-[11px] ${
              location.pathname === m.to
                ? "bg-slate-800 text-green-400"
                : "text-slate-400"
            }`}
          >
            <span className="text-lg">{m.icon}</span>
            <span>{m.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
