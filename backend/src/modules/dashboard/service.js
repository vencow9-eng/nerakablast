const prisma = require("../../config/database");

async function admin() {
  const totalUser = await prisma.user.count();
  const totalStaff = await prisma.user.count({
    where: { isStaff: true },
  });
  const totalBlast = await prisma.blast.count();
  const totalDevice = await prisma.device.count();

  const blasts = await prisma.blast.findMany();

  return {
    totalUser,
    totalStaff,
    totalBlast,
    totalDevice,
    totalRevenue: 0,
    success: blasts.reduce((a, b) => a + b.success, 0),
    failed: blasts.reduce((a, b) => a + b.failed, 0),
  };
}

async function staff(userId) {
  const totalMember = await prisma.user.count({
    where: { parentId: userId },
  });
  const totalTemplate = await prisma.template.count({
    where: { ownerId: userId },
  });
  const totalTarget = await prisma.target.count({
    where: { ownerId: userId },
  });
  const totalBlast = await prisma.blast.count({
    where: { userId },
  });

  return {
    totalMember,
    totalTemplate,
    totalTarget,
    totalBlast,
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

  return {
    totalBlastHariIni: blasts.length,
    totalSuccess: blasts.reduce((a, b) => a + b.success, 0),
    totalFailed: blasts.reduce((a, b) => a + b.failed, 0),
    whatsappConnected: connected,
  };
}

module.exports = {
  admin,
  staff,
  member,
};