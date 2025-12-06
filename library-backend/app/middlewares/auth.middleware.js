// function requireStaff(req, res, next) {
//   if (!req.session.user || req.session.user.type !== "staff") {
//     return res.status(403).json({ message: "Bạn không có quyền truy cập" });
//   }
//   next();
// }

// function requireReader(req, res, next) {
//   if (!req.session.user || req.session.user.type !== "reader") {
//     return res.status(403).json({ message: "Bạn không có quyền truy cập" });
//   }
//   next();
// }

// module.exports = { requireStaff, requireReader };
