const prisma = require("../../config/database");
const { addBlastJob } = require("../../queues/blast.queue");

async function list(userId) {
  return prisma.blast.findMany({
    where: { userId },
    include: {
      template: true,
      target: true,
    },
    orderBy: { id: "desc" },
  });
}

async function detail(id, userId) {
  return prisma.blast.findFirst({
    where: {
      id: Number(id),
      userId,
    },
    include: {
      template: true,
      target: true,
    },
  });
}

async function start(userId, data) {
  const target = await prisma.target.findFirst({
    where: {
      id: Number(data.targetId),
      ownerId: userId,
    },
  });

  if (!target) {
    throw new Error("Target tidak ditemukan");
  }

  const template = await prisma.template.findFirst({
    where: {
      id: Number(data.templateId),
      ownerId: userId,
    },
  });

  if (!template) {
    throw new Error("Template tidak ditemukan");
  }

  const phones = target.phones
    .split(",")
    .map((phone) => phone.trim())
    .filter(Boolean);

  const blast = await prisma.blast.create({
    data: {
      userId,
      templateId: template.id,
      targetId: target.id,
      total: phones.length,
      success: 0,
      failed: 0,
      status: "PENDING",
    },
  });

await addBlastJob({
  blastId: blast.id,
  userId,
});

  return {
    blast,
    phones,
    message: template.message,
  };
}

async function stop(id, userId) {
  return prisma.blast.updateMany({
    where: {
      id: Number(id),
      userId,
    },
    data: {
      status: "STOPPED",
    },
  });
}

module.exports = {
  list,
  detail,
  start,
  stop,
};