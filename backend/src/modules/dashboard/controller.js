const service = require("./service");

async function admin(req, res) {
  const data = await service.admin();
  res.json({ success: true, data });
}

async function staff(req, res) {
  const data = await service.staff(req.user.id);
  res.json({ success: true, data });
}

async function member(req, res) {
  const data = await service.member(req.user.id);
  res.json({ success: true, data });
}

module.exports = {
  admin,
  staff,
  member,
};