const prisma = require("../../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function register(data) {
  const hashed = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { username: data.username, password: hashed, role: "MEMBER" }
  });
  return user;
}

async function login(data) {
  const user = await prisma.user.findUnique({ where: { username: data.username } });
  if (!user) throw new Error("Username tidak ditemukan");
  const validPassword = await bcrypt.compare(data.password, user.password);
  if (!validPassword) throw new Error("Password salah");
  const token = jwt.sign({
    id: user.id, username: user.username, role: user.role, isStaff: user.isStaff, parentId: user.parentId
  }, process.env.JWT_SECRET, { expiresIn: "7d" });
  return { token, user: { id: user.id, username: user.username, role: user.role, isStaff: user.isStaff, parentId: user.parentId } };
}

module.exports = { register, login };
