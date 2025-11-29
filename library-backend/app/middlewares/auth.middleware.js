function requireNhanVien(req, res, next) {
  if (!req.session.user || req.session.user.type !== "nhanvien") {
    return res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
  next();
}

function requireDocGia(req, res, next) {
  if (!req.session.user || req.session.user.type !== "docgia") {
    return res.status(403).json({ message: "Bạn không có quyền truy cập" });
  }
  next();
}

module.exports = { requireNhanVien, requireDocGia };
