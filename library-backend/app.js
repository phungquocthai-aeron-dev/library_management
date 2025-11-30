const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");

const authRoutes = require("./app/routes/auth.route");
const bookRoutes = require("./app/routes/book.routes");
const publisherRoutes = require("./app/routes/publisher.route");
const circulations = require("./app/routes/circulation.route");

const ApiError = require("./app/errors/api-error");

const app = express();

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

app.use(
  session({
    secret: "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to library application." });
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/publishers", publisherRoutes);
app.use("/api/circulations", circulations);

app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
