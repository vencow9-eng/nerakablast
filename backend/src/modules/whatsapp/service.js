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

function getSessionPath(sessionId) {
  return path.join(
    process.cwd(),
    "storage",
    "sessions",
    sessionId
  );
}

async function connect(deviceId, userId) {
  const device = await prisma.device.findFirst({
    where: {
      id: Number(deviceId),
      userId: Number(userId),
    },
  });

  if (!device) {
    throw new Error("Device tidak ditemukan");
  }

  if (sessions.has(device.id)) {
    return {
      deviceId: device.id,
      sessionId: device.sessionId,
      status: device.status,
    };
  }

  const sessionPath = getSessionPath(device.sessionId);

  const { state, saveCreds } =
    await useMultiFileAuthState(sessionPath);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: "silent" }),
    browser: ["SEWAWAPRO", "Chrome", "1.0.0"],
  });

  sessions.set(device.id, sock);

  await prisma.device.update({
    where: {
      id: device.id,
    },
    data: {
      status: "CONNECTING",
    },
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      const qrImage = await qrcode.toDataURL(qr);
      qrCache.set(device.id, qrImage);
    }

    if (connection === "open") {
      await prisma.device.update({
        where: {
          id: device.id,
        },
        data: {
          status: "CONNECTED",
        },
      });

      qrCache.delete(device.id);
    }

    if (connection === "close") {
      const statusCode =
        lastDisconnect?.error?.output?.statusCode;

      const shouldReconnect =
        statusCode !== DisconnectReason.loggedOut;

      sessions.delete(device.id);
      qrCache.delete(device.id);

      await prisma.device.update({
        where: {
          id: device.id,
        },
        data: {
          status: "DISCONNECTED",
        },
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

async function ensureSession(deviceId) {
  const device = await prisma.device.findUnique({
    where: {
      id: Number(deviceId),
    },
  });

  if (!device) {
    throw new Error("Device tidak ditemukan");
  }

  let sock = sessions.get(device.id);

  if (sock) {
    return sock;
  }

  await connect(device.id, device.userId);

  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    sock = sessions.get(device.id);

    const latest = await prisma.device.findUnique({
      where: {
        id: device.id,
      },
    });

    if (sock && latest?.status === "CONNECTED") {
      return sock;
    }
  }

  throw new Error("Device belum connect");
}

async function sendMessage(deviceId, phone, message) {
  const sock = await ensureSession(deviceId);

  const jid =
    String(phone).replace(/\D/g, "") +
    "@s.whatsapp.net";

  await sock.sendMessage(jid, {
    text: String(message || ""),
  });

  return {
    phone,
    status: "SENT",
  };
}

async function getStatus(deviceId, userId) {
  const device = await prisma.device.findFirst({
    where: {
      id: Number(deviceId),
      userId: Number(userId),
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
    pairingCode: pairingCache.get(device.id) || null,
  };
}

async function getQrImage(deviceId) {
  const qr = qrCache.get(Number(deviceId));

  if (!qr) {
    throw new Error("QR belum tersedia");
  }

  return qr;
}

async function requestPairing(deviceId, phone) {
  const device = await prisma.device.findUnique({
    where: {
      id: Number(deviceId),
    },
  });

  if (!device) {
    throw new Error("Device tidak ditemukan");
  }

  let sock = sessions.get(device.id);

  if (!sock) {
    await connect(device.id, device.userId);

    await new Promise((resolve) =>
      setTimeout(resolve, 2000)
    );

    sock = sessions.get(device.id);
  }

  if (!sock) {
    throw new Error("Device belum connect");
  }

  const cleanPhone = String(phone)
    .replace("+", "")
    .replace(/\s/g, "");

  const code = await sock.requestPairingCode(cleanPhone);

  pairingCache.set(device.id, code);

  return {
    deviceId: device.id,
    phone: cleanPhone,
    code,
  };
}

async function disconnect(deviceId, userId) {
  const device = await prisma.device.findFirst({
    where: {
      id: Number(deviceId),
      userId: Number(userId),
    },
  });

  if (!device) {
    throw new Error("Device tidak ditemukan");
  }

  const sock = sessions.get(device.id);

  if (sock) {
    try {
      await sock.logout();
    } catch (e) {}

    sessions.delete(device.id);
  }

  qrCache.delete(device.id);
  pairingCache.delete(device.id);

  await prisma.device.update({
    where: {
      id: device.id,
    },
    data: {
      status: "DISCONNECTED",
    },
  });

  return {
    id: device.id,
    status: "DISCONNECTED",
  };
}

module.exports = {
  connect,
  getStatus,
  getQrImage,
  requestPairing,
  sendMessage,
  disconnect,
};
