const express = require("express");
const router = express.Router();
const CirculationController = require("../controllers/circulation.controller");

router.post("/borrow", CirculationController.borrowBook);

router.post("/confirm", CirculationController.confirmBorrow);

router.post("/return", CirculationController.returnBook);

router.post("/cancel", CirculationController.cancelBorrow);

router.get("/overdue", CirculationController.findOverdue);

router.get("/reader/:readerId", CirculationController.getByReader);

module.exports = router;
