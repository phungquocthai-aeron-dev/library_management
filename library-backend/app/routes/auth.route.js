const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");

// === Register ===
router.post("/register/reader", AuthController.registerReader);
router.post("/register/staff", AuthController.registerStaff);

// === Login / Logout ===
router.post("/login/reader", AuthController.loginReader);
router.post("/login/staff", AuthController.loginStaff);
router.post("/logout", AuthController.logout);

// === Update info & password ===
router.put("/reader", AuthController.updateReader);
router.put("/reader/password", AuthController.updatePasswordReader);
router.put("/staff", AuthController.updateStaff);
router.put("/staff/password", AuthController.updatePasswordStaff);

// === Activate / Deactivate ===
// Reader
router.put("/reader/:id/activate", AuthController.activateReader);
router.put("/reader/:id/deactivate", AuthController.deactivateReader);

// Staff
router.put("/staff/:id/activate", AuthController.activateStaff);
router.put("/staff/:id/deactivate", AuthController.deactivateStaff);

// === Update Role (Staff) ===
router.put("/staff/:id/role", AuthController.updateRoleStaff);

module.exports = router;
