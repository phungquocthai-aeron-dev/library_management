const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");

const {
  requireNhanVien,
  requireDocGia,
} = require("../middlewares/auth.middleware");

// === Register ===
router.post("/register/reader", AuthController.registerReader);
router.post("/register/staff", AuthController.registerStaff);

// === Login / Logout ===
router.post("/login/reader", AuthController.loginReader);
router.post("/login/staff", AuthController.loginStaff);
router.post("/logout", AuthController.logout);

// === Update info & password ===
router.put("/staff/:id", requireNhanVien, AuthController.updateStaff);
router.put(
  "/staff/:id/password",
  requireNhanVien,
  AuthController.updatePasswordStaff
);
router.put("/reader/:id", requireDocGia, AuthController.updateReader);
router.put(
  "/reader/:id/password",
  requireDocGia,
  AuthController.updatePasswordReader
);

// === Activate / Deactivate ===
// Reader
router.put(
  "/reader/:id/activate",
  requireNhanVien,
  AuthController.activateReader
);
router.put(
  "/reader/:id/deactivate",
  requireNhanVien,
  AuthController.deactivateReader
);

// Staff
router.put(
  "/staff/:id/activate",
  requireNhanVien,
  AuthController.activateStaff
);
router.put(
  "/staff/:id/deactivate",
  requireNhanVien,
  AuthController.deactivateStaff
);

// === Update Role (Staff) ===
router.put("/staff/:id/role", requireNhanVien, AuthController.updateRoleStaff);

module.exports = router;
