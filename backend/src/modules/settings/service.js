let settings = {
  maintenanceMode: false,
  allowRegister: true,
  platformName: "SEWAWAPRO",
};

async function getSettings() {
  return settings;
}

async function updateSettings(data) {
  settings = {
    ...settings,
    ...data,
  };

  return settings;
}

module.exports = {
  getSettings,
  updateSettings,
};
