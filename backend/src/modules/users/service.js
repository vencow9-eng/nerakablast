const prisma = require("../../config/database");

async function getUsers() {
  return prisma.user.findMany({
    select: { id: true, username: true, role: true, isActive: true, isStaff: true, parentId: true, createdAt: true }
  });
}

async function updateRole(id, role) {
  return prisma.user.update({
    where: { id: Number(id) },
    data: { role }
  });
}

async function updateStaff(id, isStaff) {
  return prisma.user.update({
    where: { id: Number(id) },
    data: { isStaff }
  });
}

module.exports = { getUsers, updateRole, updateStaff };
