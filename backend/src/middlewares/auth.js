const jwt = require("jsonwebtoken");
const prisma = require("../config/database");

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ success: false, message: "Token tidak ada" });

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, role: true, isStaff: true, parentId: true, isActive: true }
    });

    if (!user) return res.status(401).json({ success: false, message: "User tidak ditemukan" });
    if (!user.isActive) return res.status(403).json({ success: false, message: "Akun nonaktif" });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: "Token tidak valid" });
  }
}

module.exports = auth;
