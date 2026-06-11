const service = require("./service");

async function list(req, res) {
  const data = await service.list(
    req.user.id
  );

  res.json({
    success: true,
    data,
  });
}

async function stats(req, res) {
  const data = await service.stats(
    req.user.id
  );

  res.json({
    success: true,
    data,
  });
}

module.exports = {
  list,
  stats,
};