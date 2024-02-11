const User = require("../models/User");
const Message = require("../models/Message");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const nconf = require("nconf");
const passport = require("../controllers/../server/passport");
const { body, validationResult } = require("express-validator");

exports.home = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    const message_list = await Message.find({})
      .populate("user")
      .sort({ timestamp: 1 })
      .exec();
    // console.log("req.user in home route", req.user);
    // console.log("req.isAthenticated()", req.isAuthenticated());
    res.render("home", { message_list });
  } else {
    res.redirect("/user/login?status=Please login first");
  }
});

exports.login_get = asyncHandler(async (req, res, next) => {
  const status = req.query.status;
  res.render("login-form", { title: "Login Form", status });
});

exports.login_post = passport.authenticate("local", {
  successRedirect: "/user/home",
  failureRedirect: "/user/login",
});

exports.log_out_get = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    } else {
      res.redirect("/user/login");
    }
  });
});

exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.render("sign-up-form", { title: "Sign Up" });
});
exports.sign_up_post = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("Fist name is required")
    .escape(),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .escape(),
  body("username")
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email address")
    .escape(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword()
    .withMessage("Enter a strong password"),
  body("conf_password")
    .trim()
    .notEmpty()
    .withMessage("Re-enter password")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords does not match"),
  asyncHandler(async (req, res, next) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const errors = validationResult(req);
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: hashedPassword,
    });

    if (!errors.isEmpty()) {
      res.render("sign-up-form", {
        title: "Sign Up",
        user,
        errors: errors.array(),
      });
      return;
    }
    // Check whether same email is already registered
    const emailExists = await User.findOne({ username: req.body.username });

    if (!emailExists) {
      await user.save();
      res.redirect("/user/login?status=Successfully signed up!");
      return;
    } else {
      res.render("sign-up-form", {
        title: "Sign Up",
        user,
        errors: [{ msg: "This email is already registered!" }],
      });
    }
  }),
];

exports.join_club_get = asyncHandler(async (req, res, next) => {
  console.log("req.user in join club route", req.user);
  console.log("req.isAthenticated()", req.isAuthenticated());
  res.render("join-club-form", { title: "Join Private Club" });
});
exports.join_club_post = [
  body("code")
    .trim()
    .custom((value) => {
      const code = nconf.get("CLUB_CODE");
      return value === code;
    })
    .withMessage("Incorrect code"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("join-club-form", {
        title: "Join Private Club",
        errors: errors.array(),
      });
      return;
    }
    console.log("req.user before", req.user);
    const user = await User.findOne({ username: req.user.username });

    if (user) {
      user.membership = true;
      await user.save();
      console.log("user from database", user);
      console.log("req.user after", req.user);
      res.redirect("/user/home");
    } else {
      const err = new Error("User does not exist");
      next(err);
    }
  }),
];

exports.admin_login_get = asyncHandler(async (req, res, next) => {
  res.render("admin-form", { title: "Admin Login Form" });
});
exports.admin_login_post = [
  body("code")
    .trim()
    .custom((value) => {
      const code = nconf.get("ADMIN_CODE");
      return value === code;
    })
    .withMessage("Incorrect code"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("admin-form", {
        title: "Admin Login Form",
        errors: errors.array(),
      });
      return;
    }
    console.log("req.user before", req.user);
    const user = await User.findOne({ username: req.user.username });

    if (user) {
      user.isAdmin = true;
      await user.save();
      console.log("user from database", user);
      console.log("req.user after", req.user);
      res.redirect("/user/home");
    } else {
      const err = new Error("User does not exist");
      next(err);
    }
  }),
];

exports.delete_message = asyncHandler(async (req, res, next) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  res.redirect("/user/home");
});
