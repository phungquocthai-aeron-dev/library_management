const express = require("express");
const router = express.Router();
const CirculationController = require("../controllers/circulation.controller");

router.post("/borrow", CirculationController.borrowBook);

router.post("/return", CirculationController.returnBook);

router.get("/overdue", CirculationController.findOverdue);

module.exports = router;
