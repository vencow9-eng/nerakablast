const prisma = require("../../config/database");

async function list(userId) {
  return prisma.device.findMany({
    where: { userId },
    orderBy: { id: "desc" },
  });
}

async function adminList() {
  const devices = await prisma.device.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
          role: true,
        },
      },
    },
    orderBy: { id: "desc" },
  });

  return devices.map((d) => ({
    id: d.id,
    userId: d.userId,
    username: d.user?.username || "-",
    role: d.user?.role || "-",
    sessionId: d.sessionId,
    status: d.status,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  }));
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
  adminList,
  create,
  remove,
};
