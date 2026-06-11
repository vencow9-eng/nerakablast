const { Queue } = require("bullmq");
const redis = require("../config/redis");

const blastQueue = new Queue("blastQueue", {
  connection: redis,
});

async function addBlastJob(data) {
  return blastQueue.add("sendBlast", data, {
    attempts: 3,
    backoff: {
      type: "fixed",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  });
}

module.exports = {
  blastQueue,
  addBlastJob,
};