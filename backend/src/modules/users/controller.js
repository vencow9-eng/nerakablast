const userService = require("./service");

async function getUsers(req, res) {
  const users = await userService.getUsers();
  res.json({ success: true, data: users });
}

async function updateRole(req, res) {
  const user = await userService.updateRole(req.params.id, req.body.role);
  res.json({ success: true, data: user });
}

async function updateStaff(req, res) {
  const user = await userService.updateStaff(req.params.id, req.body.isStaff);
  res.json({ success: true, data: user });
}

module.exports = { getUsers, updateRole, updateStaff };
