function roleGuard(...roles) {
  return function(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Belum login" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Akses ditolak" });
    }

    next();
  };
}

module.exports = roleGuard;
