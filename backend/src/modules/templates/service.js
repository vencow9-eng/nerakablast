const prisma = require("../../config/database");

async function list(userId) {
  return prisma.template.findMany({
    where: { ownerId: userId },
    orderBy: { id: "desc" },
  });
}

async function create(userId, data) {
  return prisma.template.create({
    data: {
      ownerId: userId,
      title: data.title,
      message: data.message,
    },
  });
}

async function update(id, userId, data) {
  return prisma.template.updateMany({
    where: { id: Number(id), ownerId: userId },
    data: {
      title: data.title,
      message: data.message,
      isActive: data.isActive,
    },
  });
}

async function remove(id, userId) {
  return prisma.template.deleteMany({
    where: { id: Number(id), ownerId: userId },
  });
}

module.exports = { list, create, update, remove };