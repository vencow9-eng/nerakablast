const prisma = require("../../config/database");

async function getUsers() {
  const users = await prisma.user.findMany({
    include: {
      devices: true,
      blasts: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  return users.map((u) => ({
    id: u.id,
    username: u.username,
    role: u.role,

    isActive: u.isActive,
    isStaff: u.isStaff,

    totalDevice: u.devices?.length || 0,

    connectedDevice:
      u.devices?.filter(
        (x) => x.status === "CONNECTED"
      ).length || 0,

    totalBlast: u.blasts?.length || 0,

    totalSuccess:
      u.blasts?.reduce(
        (a, b) => a + (b.success || 0),
        0
      ) || 0,

    totalFailed:
      u.blasts?.reduce(
        (a, b) => a + (b.failed || 0),
        0
      ) || 0,

    createdAt: u.createdAt,
  }));
}

async function updateRole(id, role) {
  return prisma.user.update({
    where: {
      id: Number(id),
    },

    data: {
      role,
    },
  });
}

async function updateStaff(id, isStaff) {
  return prisma.user.update({
    where: {
      id: Number(id),
    },

    data: {
      isStaff,
    },
  });
}

module.exports = {
  getUsers,
  updateRole,
  updateStaff,
};
