const session = require("express-session");

const sessionMiddleware = session({
  secret: "cat",
  resave: false,
  saveUninitialized: true,
});

module.exports = sessionMiddleware;
