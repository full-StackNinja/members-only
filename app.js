const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const nconf = require("nconf");
require("dotenv").config();
const mongoose = require("mongoose");
const passport = require("./server/passport");
const sessionMiddleware = require("./server/session");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

// Load env variables
nconf.env();

const main = async () => {
  const db = nconf.get("MONGODB_URI");
  await mongoose.connect(db);
  console.log("database connected!");
};
main().catch((err) => {
  console.log(err);
});

const app = express();

app.use(sessionMiddleware);

// Initialize and use passport session to manage sessions
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.user = req.user;
  next()
});

app.use("/", indexRouter);
app.use("/user", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
