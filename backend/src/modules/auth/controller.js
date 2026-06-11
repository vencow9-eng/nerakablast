const authService = require("./service");

async function register(req, res) {
  try {
    const result = await authService.register(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

async function login(req, res) {
  try {
    const result = await authService.login(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}
async function me(req, res) {
  res.json({
    success: true,
    data: req.user,
  });
}
module.exports = {
  register,
  login,
  me,
};
