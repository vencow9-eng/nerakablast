const prisma = require("../../config/database");

async function admin() {
  const totalUser = await prisma.user.count();
  const totalMember = await prisma.user.count({
    where: { role: "MEMBER" },
  });
  const totalAdmin = await prisma.user.count({
    where: { role: "ADMIN" },
  });
  const totalBlast = await prisma.blast.count();
  const totalDevice = await prisma.device.count();
  const connectedDevice = await prisma.device.count({
    where: { status: "CONNECTED" },
  });

  const blasts = await prisma.blast.findMany({
    include: {
      user: true,
      template: true,
      target: true,
    },
    orderBy: { id: "desc" },
    take: 10,
  });

  const success = blasts.reduce((a, b) => a + (b.success || 0), 0);
  const failed = blasts.reduce((a, b) => a + (b.failed || 0), 0);
  const totalSent = success + failed;

  const runningBlast = await prisma.blast.count({
    where: { status: "RUNNING" },
  });

  const completedBlast = await prisma.blast.count({
    where: { status: "COMPLETED" },
  });

  const failedBlast = await prisma.blast.count({
    where: { status: "FAILED" },
  });

  return {
    totalUser,
    totalMember,
    totalAdmin,
    totalBlast,
    totalDevice,
    connectedDevice,
    runningBlast,
    completedBlast,
    failedBlast,
    totalRevenue: 0,
    success,
    failed,
    totalSent,
    recentBlasts: blasts.map((b) => ({
      id: b.id,
      user: b.user?.username || "-",
      template: b.template?.title || "-",
      target: b.target?.name || "-",
      total: b.total,
      success: b.success,
      failed: b.failed,
      status: b.status,
      createdAt: b.createdAt,
    })),
  };
}

async function member(userId) {
  const blasts = await prisma.blast.findMany({
    where: { userId },
  });

  const connected = await prisma.device.count({
    where: {
      userId,
      status: "CONNECTED",
    },
  });

  const totalSuccess = blasts.reduce((a, b) => a + (b.success || 0), 0);
  const totalFailed = blasts.reduce((a, b) => a + (b.failed || 0), 0);

  return {
    totalBlastHariIni: blasts.length,
    totalSuccess,
    totalFailed,
    whatsappConnected: connected,
  };
}

module.exports = {
  admin,
  member,
};
