const prisma = require("../../config/database");

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
      createdAt: "desc",
    },
  });
}

async function stats(userId) {
  const rows = await prisma.blast.findMany({
    where: {
      userId,
    },
  });

  return {
    totalBlast: rows.length,

    success: rows.reduce(
      (a, b) => a + (b.success || 0),
      0
    ),

    failed: rows.reduce(
      (a, b) => a + (b.failed || 0),
      0
    ),

    pending: rows.filter(
      (x) => x.status === "PENDING"
    ).length,

    completed: rows.filter(
      (x) => x.status === "COMPLETED"
    ).length,

    stopped: rows.filter(
      (x) => x.status === "STOPPED"
    ).length,
  };
}

module.exports = {
  list,
  stats,
};