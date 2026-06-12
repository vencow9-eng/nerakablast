const { Worker } = require("bullmq");

const redis = require("../config/redis");
const prisma = require("../config/database");
const { getIO } = require("../config/socket");

const worker = new Worker(
  "blastQueue",

  async (job) => {
    const io = getIO();

    const { blastId } = job.data;

    console.log(`START BLAST #${blastId}`);

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
      },
    });

    io.emit("blast:update", {
      id: blast.id,
      status: "RUNNING",
    });

    const phones = blast.target.phones
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    let success = 0;
    let failed = 0;

    for (let i = 0; i < phones.length; i++) {
      const phone = phones[i];

      try {
        console.log(`SEND -> ${phone}`);

        /*
          NEXT:
          nanti diganti kirim WA real:

          await whatsapp.sendMessage(
            device,
            phone,
            blast.template.message
          );
        */

        await new Promise((r) => setTimeout(r, 1500));

        success++;

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

        io.emit("blast:progress", {
          blastId: blast.id,
          total: phones.length,
          current: i + 1,
          success,
          failed,
          percent: Math.round(((i + 1) / phones.length) * 100),
        });

        console.log(
          `[${i + 1}/${phones.length}] SUCCESS`
        );
      } catch (err) {
        failed++;

        console.log(
          `[${i + 1}/${phones.length}] FAILED`,
          err.message
        );

        await prisma.blast.update({
          where: {
            id: blast.id,
          },
          data: {
            success,
            failed,
          },
        });

        io.emit("blast:error", {
          blastId: blast.id,
          phone,
          error: err.message,
        });
      }
    }

    await prisma.blast.update({
      where: {
        id: blast.id,
      },
      data: {
        success,
        failed,
        status: "COMPLETED",
      },
    });

    io.emit("blast:completed", {
      blastId: blast.id,
      success,
      failed,
    });

    console.log(`DONE BLAST #${blast.id}`);

    return {
      blastId,
      total: phones.length,
      success,
      failed,
    };
  },

  {
    connection: redis,

    concurrency: 1,

    removeOnComplete: {
      count: 50,
    },

    removeOnFail: {
      count: 20,
    },
  }
);

worker.on("completed", (job) => {
  console.log(
    `JOB ${job.id} COMPLETED`
  );
});

worker.on("failed", (job, err) => {
  console.log(
    `JOB ${job?.id} FAILED`,
    err.message
  );
});

worker.on("error", (err) => {
  console.log(
    "WORKER ERROR:",
    err.message
  );
});

process.on("SIGINT", async () => {
  console.log("Closing worker...");

  await worker.close();

  process.exit(0);
});

module.exports = worker;