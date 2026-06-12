require("dotenv").config();

const { Worker } = require("bullmq");
const redis = require("../config/redis");
const prisma = require("../config/database");
const whatsapp = require("../modules/whatsapp/service");

let io = null;

try {
  const socketConfig = require("../config/socket");
  io = socketConfig.getIO ? socketConfig.getIO() : null;
} catch (e) {
  io = null;
}

function emitProgress(data) {
  if (io) {
    io.emit("blast:progress", data);
  }
}

const worker = new Worker(
  "blastQueue",
  async (job) => {
    const { blastId } = job.data;

    console.log("START BLAST #" + blastId);

    const blast = await prisma.blast.findUnique({
      where: {
        id: Number(blastId),
      },
      include: {
        template: true,
        target: true,
      },
    });

    if (!blast) {
      throw new Error("Blast tidak ditemukan");
    }

    await prisma.blast.update({
      where: {
        id: blast.id,
      },
      data: {
        status: "RUNNING",
        success: 0,
        failed: 0,
      },
    });

    const device = await prisma.device.findFirst({
      where: {
        userId: blast.userId,
        status: "CONNECTED",
      },
      orderBy: {
        id: "desc",
      },
    });

    if (!device) {
      await prisma.blast.update({
        where: {
          id: blast.id,
        },
        data: {
          status: "FAILED",
        },
      });

      throw new Error("Tidak ada device WhatsApp CONNECTED");
    }

    const phones = String(blast.target?.phones || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    let success = 0;
    let failed = 0;

    for (const phone of phones) {
      const currentBlast = await prisma.blast.findUnique({
        where: {
          id: blast.id,
        },
      });

      if (currentBlast?.status === "STOPPED") {
        console.log("BLAST STOPPED #" + blast.id);

        emitProgress({
          blastId: blast.id,
          success,
          failed,
          total: phones.length,
          status: "STOPPED",
        });

        return {
          blastId: blast.id,
          success,
          failed,
          stopped: true,
        };
      }

      try {
        console.log("SEND TO", phone);

        await whatsapp.sendMessage(
          device.id,
          phone,
          blast.template.message
        );

        success++;
      } catch (e) {
        console.log("FAILED SEND", phone, e.message);
        failed++;
      }

      await prisma.blast.update({
        where: {
          id: blast.id,
        },
        data: {
          success,
          failed,
          status: "RUNNING",
        },
      });

      emitProgress({
        blastId: blast.id,
        phone,
        success,
        failed,
        total: phones.length,
        status: "RUNNING",
      });

      const latestBlast = await prisma.blast.findUnique({
        where: {
          id: blast.id,
        },
      });

      if (latestBlast?.status === "STOPPED") {
        console.log("BLAST STOPPED AFTER SEND #" + blast.id);

        emitProgress({
          blastId: blast.id,
          success,
          failed,
          total: phones.length,
          status: "STOPPED",
        });

        return {
          blastId: blast.id,
          success,
          failed,
          stopped: true,
        };
      }

      await new Promise((resolve) =>
        setTimeout(resolve, blast.delayMs || 15000)
      );
    }

    const finalStatus =
      failed > 0 && success === 0 ? "FAILED" : "COMPLETED";

    await prisma.blast.update({
      where: {
        id: blast.id,
      },
      data: {
        success,
        failed,
        status: finalStatus,
      },
    });

    emitProgress({
      blastId: blast.id,
      success,
      failed,
      total: phones.length,
      status: finalStatus,
    });

    console.log("BLAST FINISHED #" + blast.id + " " + finalStatus);

    return {
      blastId: blast.id,
      success,
      failed,
      status: finalStatus,
    };
  },
  {
    connection: redis,
  }
);

worker.on("completed", (job) => {
  console.log("Blast completed:", job.id);
});

worker.on("failed", (job, err) => {
  console.log("Blast failed:", job?.id, err.message);
});

process.on("SIGINT", async () => {
  console.log("Closing worker...");
  await worker.close();
  process.exit(0);
});

module.exports = worker;
