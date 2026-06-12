const service = require("./service");

async function list(req, res) {
  const data = await service.list(req.user.id);

  res.json({
    success: true,
    data,
  });
}

async function adminList(req, res) {
  try {
    const data = await service.adminList();
    res.json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function create(req, res) {
  const data = await service.create(req.user.id);

  res.json({
    success: true,
    data,
  });
}

async function remove(req, res) {
  const data = await service.remove(req.params.id, req.user.id);

  res.json({
    success: true,
    data,
  });
}

module.exports = { 
  list,
  adminList,
  create,
  remove,
};
