import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Settings() {
  const [settings, setSettings] = useState({
    platformName: "SEWAWAPRO",
    maintenanceMode: false,
    allowRegister: true,
    defaultDelay: "medium",
    autoReconnect: true,
    maxTarget: 500,
  });

  async function load() {
    try {
      const res = await api.get("/settings");
      setSettings((prev) => ({
        ...prev,
        ...(res.data.data || {}),
      }));
    } catch (e) {
      alert(e.response?.data?.message || "Gagal load settings");
    }
  }

  function update(key, value) {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function save() {
    try {
      await api.patch("/settings", settings);
      alert("Settings berhasil disimpan global");
    } catch (e) {
      alert(e.response?.data?.message || "Gagal simpan settings");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6 pb-28">
      <div>
        <h1 className="text-3xl md:text-5xl font-black">Admin Settings</h1>
        <p className="text-slate-400 mt-2">
          Pusat kontrol sistem SEWAWAPRO.
        </p>
      </div>

      <Section title="General">
        <Input
          label="Platform Name"
          value={settings.platformName}
          onChange={(v) => update("platformName", v)}
        />

        <Toggle
          label="Maintenance Mode"
          value={settings.maintenanceMode}
          onChange={(v) => update("maintenanceMode", v)}
        />

        <Toggle
          label="Public Register"
          value={settings.allowRegister}
          onChange={(v) => update("allowRegister", v)}
        />
      </Section>

      <Section title="Blast Rules">
        <Select
          label="Default Speed"
          value={settings.defaultDelay}
          onChange={(v) => update("defaultDelay", v)}
          options={[
            { value: "slow", label: "Slow" },
            { value: "medium", label: "Medium" },
            { value: "fast", label: "Fast" },
            { value: "very_fast", label: "Very Fast" },
          ]}
        />

        <Input
          label="Max Target Per Blast"
          value={settings.maxTarget}
          onChange={(v) => update("maxTarget", Number(v))}
          type="number"
        />
      </Section>

      <Section title="WhatsApp">
        <Toggle
          label="Auto Reconnect"
          value={settings.autoReconnect}
          onChange={(v) => update("autoReconnect", v)}
        />
      </Section>

      <button
        onClick={save}
        className="w-full bg-green-500 hover:bg-green-600 rounded-2xl p-5 font-black"
      >
        Simpan Settings Global
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
      <h2 className="text-xl font-black">{title}</h2>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <p className="text-slate-400 text-sm mb-2">{label}</p>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 outline-none focus:border-green-500"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <p className="text-slate-400 text-sm mb-2">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 outline-none focus:border-green-500"
      >
        {options.map((x) => (
          <option key={x.value} value={x.value}>
            {x.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between bg-slate-800 rounded-2xl p-4">
      <span className="font-bold">{label}</span>

      <button
        type="button"
        onClick={() => onChange(!value)}
        className={
          value
            ? "bg-green-500 px-5 py-2 rounded-xl font-black"
            : "bg-slate-700 px-5 py-2 rounded-xl font-black"
        }
      >
        {value ? "ON" : "OFF"}
      </button>
    </div>
  );
}
