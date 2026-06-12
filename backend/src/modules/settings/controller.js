const service = require("./service");

async function get(req, res) {
  try {
    const data = await service.getSettings();
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function update(req, res) {
  try {
    const data = await service.updateSettings(req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = {
  get,
  update,
};
