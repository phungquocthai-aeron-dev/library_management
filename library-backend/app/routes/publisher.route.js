const express = require("express");
const router = express.Router();
const publisherController = require("../controllers/publisher.controller");

router
  .route("/")
  .get(publisherController.getAll)
  .post(publisherController.create);

router
  .route("/:id")
  .get(publisherController.getById)
  .put(publisherController.update)
  .delete(publisherController.delete);

module.exports = router;
