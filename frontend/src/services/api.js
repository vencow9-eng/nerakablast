import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization =
      `Bearer ${token}`;
  }

  return config;
});

async function refreshSettings() {
  try {
    const res = await axios.get("/api/settings");

    localStorage.setItem(
      "sewawapro_settings_cache",
      JSON.stringify(res.data.data || {})
    );
  } catch {}
}

refreshSettings();

setInterval(() => {
  refreshSettings();
}, 10000);

export default api;
