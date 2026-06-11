const path = require("path");
const qrcode = require("qrcode");
const pino = require("pino");
const prisma = require("../../config/database");

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
} = require("@whiskeysockets/baileys");

const sessions = new Map();
const qrCache = new Map();
const pairingCache = new Map();

async function connect(deviceId, userId) {
  const device = await prisma.device.findFirst({
    where: {
      id: Number(deviceId),
      userId,
    },
  });

  if (!device) {
    throw new Error("Device tidak ditemukan");
  }

  const sessionPath = path.join(
    process.cwd(),
    "storage",
    "sessions",
    device.sessionId
  );

  const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }),
    browser: ["RUPIAHBLAST", "Chrome", "1.0.0"],
  });

  sessions.set(device.id, sock);

  await prisma.device.update({
    where: { id: device.id },
    data: { status: "CONNECTING" },
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      const qrImage = await qrcode.toDataURL(qr);
      qrCache.set(device.id, qrImage);

      await prisma.device.update({
        where: { id: device.id },
        data: { status: "CONNECTING" },
      });
    }

    if (connection === "open") {
      await prisma.device.update({
        where: { id: device.id },
        data: { status: "CONNECTED" },
      });

      qrCache.delete(device.id);
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      await prisma.device.update({
        where: { id: device.id },
        data: { status: "DISCONNECTED" },
      });

      if (shouldReconnect) {
        setTimeout(() => {
          connect(device.id, userId).catch(() => {});
        }, 3000);
      }
    }
  });

  return {
    deviceId: device.id,
    sessionId: device.sessionId,
    status: "CONNECTING",
  };
}

async function getStatus(deviceId, userId) {
  const device = await prisma.device.findFirst({
    where: {
      id: Number(deviceId),
      userId,
    },
  });

  if (!device) {
    throw new Error("Device tidak ditemukan");
  }

  return {
    id: device.id,
    sessionId: device.sessionId,
    status: device.status,
    qr: qrCache.get(device.id) || null,
  };
}

async function getQrImage(deviceId) {
  const qr = qrCache.get(Number(deviceId));

  if (!qr) {
    throw new Error("QR belum tersedia atau device sudah connected");
  }

  return qr;
}

async function disconnect(deviceId, userId) {
  const device = await prisma.device.findFirst({
    where: {
      id: Number(deviceId),
      userId,
    },
  });

  if (!device) {
    throw new Error("Device tidak ditemukan");
  }

  const sock = sessions.get(device.id);

  if (sock) {
    await sock.logout();
    sessions.delete(device.id);
  }

  qrCache.delete(device.id);

  await prisma.device.update({
    where: { id: device.id },
    data: { status: "DISCONNECTED" },
  });

  return {
    id: device.id,
    status: "DISCONNECTED",
  };
}
async function requestPairing(deviceId, phone) {
  const sock = sessions.get(Number(deviceId));

  if (!sock) {
    throw new Error("Device belum connect");
  }

  const code = await sock.requestPairingCode(
    String(phone)
      .replace("+", "")
      .replace(/\s/g, "")
  );

  pairingCache.set(Number(deviceId), code);

  return {
    deviceId,
    phone,
    code,
  };
}

module.exports = {
  connect,
  getStatus,
  getQrImage,
  requestPairing,
  disconnect,
};