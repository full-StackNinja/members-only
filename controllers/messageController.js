const Message = require("../models/Message");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.create_message_get = asyncHandler(async (req, res, next) => {
  res.render("message-form", { title: "Create Message" });
});
exports.create_message_post = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title length should not exceed 100 chars")
    .escape(),
  body("detail")
    .trim()
    .notEmpty()
    .withMessage("Message detail is required")
    .isLength({ max: 1000 })
    .withMessage("Message detail cannot exceed 1000 chars")
    .escape(),
  asyncHandler(async (req, res, next) => {
    console.log("req.user in message post", req.user)
    const errors = validationResult(req);
    const message = new Message({
      title: req.body.title,
      detail: req.body.detail,
      user: req.user._id,
    });

    console.log("message", message)


    if (!errors.isEmpty()) {
      res.render("message-form", {
        title: "Create Message",
        message,
        errors: errors.array(),
      });
      return;
    } else {
      await message.save();
      res.redirect("/user/home");
    }
  }),
];
