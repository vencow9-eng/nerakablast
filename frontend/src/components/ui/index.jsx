export function AppCard({ children, className = "" }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-3xl p-5 ${className}`}>
      {children}
    </div>
  );
}

export function AppPanel({ children, className = "" }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-3xl p-6 ${className}`}>
      {children}
    </div>
  );
}

export function AppButton({ children, onClick, type = "button", className = "", disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-green-500 hover:bg-green-600 disabled:bg-slate-700 disabled:text-slate-400 rounded-2xl px-5 py-4 font-black ${className}`}
    >
      {children}
    </button>
  );
}

export function AppInput({ label, value, onChange, placeholder = "", type = "text" }) {
  return (
    <label className="block">
      {label && <p className="text-slate-400 text-sm mb-2">{label}</p>}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 outline-none focus:border-green-500"
      />
    </label>
  );
}

export function AppBadge({ children, variant = "default" }) {
  const cls =
    variant === "success"
      ? "bg-green-500/20 text-green-400"
      : variant === "danger"
      ? "bg-red-500/20 text-red-400"
      : variant === "warning"
      ? "bg-yellow-500/20 text-yellow-300"
      : "bg-slate-700 text-slate-300";

  return (
    <span className={`px-4 py-2 rounded-xl font-bold text-sm ${cls}`}>
      {children}
    </span>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-5xl font-black">{title}</h1>
        {subtitle && <p className="text-slate-400 mt-2">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
