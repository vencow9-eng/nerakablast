const prisma = require("../../config/database");

async function list(userId) {
  return prisma.device.findMany({
    where: { userId },
    orderBy: { id: "desc" },
  });
}

async function create(userId) {
  const sessionId = "device_" + userId + "_" + Date.now();

  return prisma.device.create({
    data: {
      userId,
      sessionId,
      status: "DISCONNECTED",
    },
  });
}

async function remove(id, userId) {
  return prisma.device.deleteMany({
    where: {
      id: Number(id),
      userId,
    },
  });
}

module.exports = {
  list,
  create,
  remove,
};