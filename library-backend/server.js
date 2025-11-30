const app = require("./app");
const config = require("./app/config");
const MongoDB = require("./app/utils/mongodb.util");
const authController = require("./app/controllers/auth.controller");
const bookController = require("./app/controllers/book.controller");
const circulationController = require("./app/controllers/circulation.controller");
const publisherController = require("./app/controllers/publisher.controller");

async function startServer() {
  try {
    await MongoDB.connect(config.db.uri);
    console.log("Connected to the database!");

    await authController.init();
    await bookController.init();
    await circulationController.init();
    await publisherController.init();

    const PORT = config.app.port || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Cannot connect to the database!", error);
    process.exit(1);
  }
}

startServer();
