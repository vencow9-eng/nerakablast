import { useEffect, useState } from "react";
import api from "../../services/api";
import { AppCard, AppButton, PageHeader } from "../../components/ui";

export default function Settings() {
  const [settings, setSettings] = useState({
    platformName: "SEWAWAPRO",
    maintenanceMode: false,
    allowRegister: true,
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
      <PageHeader
        title="Admin Settings"
        subtitle="Pusat kontrol sistem SEWAWAPRO."
      />

      <AppCard>
        <h2 className="text-xl font-black mb-5">General</h2>

        <div className="space-y-4">
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
        </div>
      </AppCard>

      <AppButton onClick={save} className="w-full">
        Simpan Settings Global
      </AppButton>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label className="block">
      <p className="text-slate-400 text-sm mb-2">{label}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
      />
    </label>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div className="bg-slate-800 rounded-2xl p-4 flex items-center justify-between">
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
