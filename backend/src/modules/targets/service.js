const prisma = require("../../config/database");

function normalizePhone(value) {
  let phone = String(value || "").replace(/\D/g, "");

  if (!phone) return null;

  if (phone.startsWith("0")) {
    phone = "62" + phone.slice(1);
  }

  if (phone.startsWith("8")) {
    phone = "62" + phone;
  }

  if (!phone.startsWith("62")) {
    return null;
  }

  if (phone.length < 10 || phone.length > 16) {
    return null;
  }

  return phone;
}

function parsePhones(text) {
  const raw = String(text || "")
    .split(/[\n,;\t ]+/)
    .map((x) => x.trim())
    .filter(Boolean);

  const phones = raw
    .map(normalizePhone)
    .filter(Boolean);

  return [...new Set(phones)];
}

async function list(userId) {
  return prisma.target.findMany({
    where: {
      ownerId: userId,
    },
    orderBy: {
      id: "desc",
    },
  });
}

async function create(userId, data) {
  if (!data.name) {
    throw new Error("Nama target wajib diisi");
  }

  const phones = parsePhones(data.phones);

  if (phones.length === 0) {
    throw new Error("Nomor target tidak valid");
  }

  return prisma.target.create({
    data: {
      ownerId: userId,
      name: data.name,
      phones: phones.join(","),
    },
  });
}

async function upload(userId, data, file) {
  if (!file) {
    throw new Error("File belum dipilih");
  }

  const name =
    data.name ||
    file.originalname.replace(/\.[^/.]+$/, "") ||
    "Target Upload";

  const text = file.buffer.toString("utf8");
  const phones = parsePhones(text);

  if (phones.length === 0) {
    throw new Error("Tidak ada nomor valid di file");
  }

  return prisma.target.create({
    data: {
      ownerId: userId,
      name,
      phones: phones.join(","),
    },
  });
}

async function update(id, userId, data) {
  const target = await prisma.target.findFirst({
    where: {
      id: Number(id),
      ownerId: userId,
    },
  });

  if (!target) {
    throw new Error("Target tidak ditemukan");
  }

  const phones = data.phones ? parsePhones(data.phones) : null;

  return prisma.target.update({
    where: {
      id: target.id,
    },
    data: {
      name: data.name || target.name,
      phones: phones ? phones.join(",") : target.phones,
    },
  });
}

async function remove(id, userId) {
  const target = await prisma.target.findFirst({
    where: {
      id: Number(id),
      ownerId: userId,
    },
  });

  if (!target) {
    throw new Error("Target tidak ditemukan");
  }

  await prisma.blast.deleteMany({
    where: {
      targetId: target.id,
      userId,
    },
  });

  return prisma.target.delete({
    where: {
      id: target.id,
    },
  });
}

module.exports = {
  list,
  create,
  upload,
  update,
  remove,
};
