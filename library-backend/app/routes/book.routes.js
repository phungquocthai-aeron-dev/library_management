const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const upload = require("../middlewares/upload");

router
  .route("/")
  .get(bookController.getAll)
  .post(upload.single("img"), bookController.create);

router
  .route("/:id")
  .get(bookController.getById)
  .put(upload.single("img"), bookController.update)
  .delete(bookController.delete);

router.delete("/:id/hard", bookController.hardDelete);

router.get("/search", bookController.search);

module.exports = router;
