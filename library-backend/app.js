const express = require("express");
const cors = require("cors");
const session = require("express-session");

const authRoutes = require("./app/routes/auth.route");
const bookRoutes = require("./app/routes/book.routes");
const publisherRoutes = require("./app/routes/publisher.route");

const ApiError = require("./app/errors/api-error");

const app = express();

app.use(cors());
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
app.use("/api/book", bookRoutes);
app.use("/api/publisher", publisherRoutes);

app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
