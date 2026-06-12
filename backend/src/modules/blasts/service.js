const prisma = require("../../config/database");
const { addBlastJob } = require("../../queues/blast.queue");

function getDelayBySpeed(speed) {
  if (speed === "slow") return 30000;
  if (speed === "fast") return 7000;
  if (speed === "very_fast") return 3000;

  return 15000;
}

async function list(userId) {
  return prisma.blast.findMany({
    where: {
      userId,
    },
    include: {
      template: true,
      target: true,
    },
    orderBy: {
      id: "desc",
    },
  });
}

async function detail(id, userId) {
  const blast = await prisma.blast.findFirst({
    where: {
      id: Number(id),
      userId,
    },
    include: {
      template: true,
      target: true,
    },
  });

  if (!blast) {
    throw new Error("Blast tidak ditemukan");
  }

  return blast;
}

async function start(userId, data) {
  const speed = data.speed || "medium";
  const delayMs = getDelayBySpeed(speed);

  const template = await prisma.template.findFirst({
    where: {
      id: Number(data.templateId),
      ownerId: userId,
      isActive: true,
    },
  });

  if (!template) {
    throw new Error("Template tidak ditemukan");
  }

  const target = await prisma.target.findFirst({
    where: {
      id: Number(data.targetId),
      ownerId: userId,
    },
  });

  if (!target) {
    throw new Error("Target tidak ditemukan");
  }

  const phones = String(target.phones || "")
    .split(",")
    .map((phone) => phone.trim())
    .filter(Boolean);

  if (phones.length === 0) {
    throw new Error("Target tidak memiliki nomor");
  }

  const connectedDevice = await prisma.device.findFirst({
    where: {
      userId,
      status: "CONNECTED",
    },
    orderBy: {
      id: "desc",
    },
  });

  if (!connectedDevice) {
    throw new Error("WhatsApp belum CONNECTED");
  }

  const blast = await prisma.blast.create({
    data: {
      userId,
      templateId: template.id,
      targetId: target.id,
      total: phones.length,
      success: 0,
      failed: 0,
      status: "PENDING",
      speed,
      delayMs,
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
  const blast = await prisma.blast.findFirst({
    where: {
      id: Number(id),
      userId,
    },
  });

  if (!blast) {
    throw new Error("Blast tidak ditemukan");
  }

  if (blast.status === "COMPLETED") {
    throw new Error("Blast sudah selesai");
  }

  await prisma.blast.update({
    where: {
      id: blast.id,
    },
    data: {
      status: "STOPPED",
    },
  });

  return {
    id: blast.id,
    status: "STOPPED",
    message: "Blast berhasil dihentikan",
  };
}

module.exports = {
  list,
  detail,
  start,
  stop,
};
