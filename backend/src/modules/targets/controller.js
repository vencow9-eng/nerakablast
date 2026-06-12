const service = require("./service");

async function list(req, res) {
  try {
    const data = await service.list(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function create(req, res) {
  try {
    const data = await service.create(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function upload(req, res) {
  try {
    const data = await service.upload(req.user.id, req.body, req.file);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function update(req, res) {
  try {
    const data = await service.update(req.params.id, req.user.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function remove(req, res) {
  try {
    const data = await service.remove(req.params.id, req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = {
  list,
  create,
  upload,
  update,
  remove,
};
