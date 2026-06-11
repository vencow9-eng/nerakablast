const service = require("./service");

async function list(req, res) {
  const data = await service.list(req.user.id);
  res.json({ success: true, data });
}

async function detail(req, res) {
  const data = await service.detail(req.params.id, req.user.id);
  res.json({ success: true, data });
}

async function start(req, res) {
  try {
    const data = await service.start(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function stop(req, res) {
  const data = await service.stop(req.params.id, req.user.id);
  res.json({ success: true, data });
}

module.exports = {
  list,
  detail,
  start,
  stop,
};