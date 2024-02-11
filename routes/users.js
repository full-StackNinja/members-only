const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");

router.get("/home", userController.home);

router.get("/login", userController.login_get);
router.post("/login", userController.login_post);

router.get("/create-message", messageController.create_message_get);
router.post("/create-message", messageController.create_message_post);

router.get("/log-out", userController.log_out_get);

router.get("/sign-up", userController.sign_up_get);
router.post("/sign-up", userController.sign_up_post);

router.get("/join-club", userController.join_club_get);
router.post("/join-club", userController.join_club_post);

router.get("/admin-login", userController.admin_login_get);
router.post("/admin-login", userController.admin_login_post);

router.get("/message/:id/delete", userController.delete_message);

module.exports = router;
