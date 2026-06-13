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
    user = { username: "member", role: "MEMBER" };
  }

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  const allMenus = [
    { to: "/dashboard",     label: "Dashboard",     icon: "ti-layout-dashboard",  roles: ["ADMIN","STAFF","MEMBER"] },
    { to: "/whatsapp",      label: "WhatsApp",      icon: "ti-brand-whatsapp",    roles: ["ADMIN","STAFF","MEMBER"] },
    { to: "/users",         label: "Users",          icon: "ti-users",             roles: ["ADMIN"] },
    { to: "/admin-devices", label: "Admin Devices",  icon: "ti-device-mobile",     roles: ["ADMIN"] },
    { to: "/admin-reports", label: "Admin Reports",  icon: "ti-report-analytics",  roles: ["ADMIN"] },
    { to: "/templates",     label: "Templates",      icon: "ti-template",          roles: ["ADMIN","STAFF"] },
    { to: "/targets",       label: "Targets",        icon: "ti-target",            roles: ["ADMIN","STAFF"] },
    { to: "/blast",         label: "Blast",          icon: "ti-rocket",            roles: ["ADMIN","STAFF","MEMBER"] },
    { to: "/reports",       label: "Reports",        icon: "ti-chart-bar",         roles: ["ADMIN","STAFF","MEMBER"] },
    { to: "/settings",      label: "Settings",       icon: "ti-settings",          roles: ["ADMIN"] },
  ];

  const menus = allMenus.filter((m) => m.roles.includes(user.role));

  // Ambil 2 huruf pertama username untuk avatar
  const avatarInitials = user.username.slice(0, 2).toUpperCase();

  // Label breadcrumb berdasarkan path aktif
  const activeMenu = allMenus.find((m) => m.to === location.pathname);
  const pageLabel = activeMenu ? activeMenu.label : "Dashboard";

  return (
    <div className="app-root">

      {/* ── SIDEBAR DESKTOP ── */}
      <aside className="app-sidebar hidden lg:flex flex-col">

        {/* Logo */}
        <div className="sidebar-logo">
          <img
            src="/assets/logo-sewa-wa.png"
            alt="SEWAWAPRO"
            style={{ height: "44px", width: "auto", maxWidth: "160px", objectFit: "contain" }}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <span style={{ display: "none" }}>
            SEWAWA<span>PRO</span>
          </span>
        </div>

        {/* Nav links */}
        <nav className="sidebar-nav">
          {menus.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className={`app-menu-link ${
                location.pathname === m.to ? "app-menu-active" : ""
              }`}
            >
              <i className={`ti ${m.icon} nav-icon`} aria-hidden="true" />
              {m.label}
            </Link>
          ))}
        </nav>

        {/* User block + logout */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{avatarInitials}</div>
            <div>
              <div className="sidebar-user-name">{user.username}</div>
              <div className="sidebar-user-role">{user.role}</div>
            </div>
          </div>
          <button onClick={logout} className="btn-danger">
            <i className="ti ti-logout" aria-hidden="true" style={{ fontSize: "13px" }} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <section
        className="flex flex-col"
        style={{ flex: 1, minWidth: 0, overflow: "hidden" }}
      >

        {/* Topbar */}
        <header className="app-topbar">

          {/* Mobile: logo + username */}
          <div className="flex items-center gap-3 lg:hidden">
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "var(--radius-sm)",
                background: "var(--app-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "13px",
                color: "#021008",
                flexShrink: 0,
              }}
            >
              S
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--app-text)" }}>
                SEWAWAPRO
              </div>
              <div style={{ fontSize: "11px", color: "var(--app-muted)" }}>
                {user.username}
              </div>
            </div>
          </div>

          {/* Desktop: breadcrumb */}
          <div className="topbar-breadcrumb hidden lg:block">
            Dashboard / <strong>{pageLabel}</strong>
          </div>

          {/* Right actions */}
          <div className="topbar-actions">
            <button className="topbar-icon-btn hidden lg:flex" title="Notifikasi" aria-label="Notifikasi">
              <i className="ti ti-bell" aria-hidden="true" />
            </button>
            <Link
              to="/blast"
              className="btn-primary"
            >
              <i className="ti ti-rocket" aria-hidden="true" style={{ fontSize: "13px" }} />
              + Blast
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="app-content" style={{ paddingBottom: "env(safe-area-inset-bottom, 80px)" }}>
          <Outlet />
        </main>
      </section>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="app-mobile-nav lg:hidden">
        {menus.slice(0, 5).map((m) => (
          <Link
            key={m.to}
            to={m.to}
            className={`mobile-nav-item ${
              location.pathname === m.to ? "active" : ""
            }`}
          >
            <i className={`ti ${m.icon}`} aria-hidden="true" />
            <span>{m.label}</span>
          </Link>
        ))}
      </nav>

    </div>
  );
}
