const User = require("../models/User");
const Message = require("../models/Message");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const passport = require("../controllers/../server/passport");
const { body, validationResult } = require("express-validator");

exports.home = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: home route");
});

exports.login_get = asyncHandler(async (req, res, next) => {
  res.render("login-form", { title: "Login Form" });
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
      res.redirect("/user/login?status='Successfully signed up!");
      return;
    } else {
      res.render("sign-up-form", {
        title: "Sign Up",
        user,
        errors: ["This email is already registered!"],
      });
    }
  }),
];

exports.join_club_get = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: join club get");
});
exports.join_club_post = asyncHandler(async (req, res, next) => {
  res.send("Not implemented: join club post");
});
