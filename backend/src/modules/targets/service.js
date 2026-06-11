const prisma = require("../../config/database");

async function list(userId) {
  return prisma.target.findMany({
    where: { ownerId: userId },
    orderBy: { id: "desc" },
  });
}

async function create(userId, data) {
  return prisma.target.create({
    data: {
      ownerId: userId,
      name: data.name,
      phones: data.phones,
    },
  });
}

async function update(id, userId, data) {
  return prisma.target.updateMany({
    where: { id: Number(id), ownerId: userId },
    data: {
      name: data.name,
      phones: data.phones,
    },
  });
}

async function remove(id, userId) {
  return prisma.target.deleteMany({
    where: { id: Number(id), ownerId: userId },
  });
}

module.exports = { list, create, update, remove };