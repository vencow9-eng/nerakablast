const service = require("./service");

async function list(req, res) {
  const data = await service.list(req.user.id);
  res.json({ success: true, data });
}

async function create(req, res) {
  const data = await service.create(req.user.id, req.body);
  res.json({ success: true, data });
}

async function update(req, res) {
  const data = await service.update(req.params.id, req.user.id, req.body);
  res.json({ success: true, data });
}

async function remove(req, res) {
  const data = await service.remove(req.params.id, req.user.id);
  res.json({ success: true, data });
}

module.exports = { list, create, update, remove };