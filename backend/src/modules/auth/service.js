const prisma = require("../../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function register(data) {
  let parentId = null;

  if (data.staffUsername) {
    const staff = await prisma.user.findUnique({
      where: {
        username: data.staffUsername,
      },
    });

    if (!staff || !staff.isStaff) {
      throw new Error("Staff tidak ditemukan");
    }

    parentId = staff.id;
  }

  const exists = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });

  if (exists) {
    throw new Error("Username sudah digunakan");
  }

  const hashed = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      username: data.username,
      password: hashed,
      role: "MEMBER",
      isActive: true,
      parentId,
    },
  });

  return {
    id: user.id,
    username: user.username,
    role: user.role,
    parentId: user.parentId,
  };
}

async function login(data) {
  const user = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });

  if (!user) {
    throw new Error("Username tidak ditemukan");
  }

  if (!user.isActive) {
    throw new Error("Akun tidak aktif");
  }

  const validPassword = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!validPassword) {
    throw new Error("Password salah");
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      isStaff: user.isStaff,
      parentId: user.parentId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      isStaff: user.isStaff,
      parentId: user.parentId,
    },
  };
}

module.exports = {
  register,
  login,
};
