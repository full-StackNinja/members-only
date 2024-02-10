const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { route } = require(".");

router.get("/home", userController.home);

router.get("/login", userController.login_get);
router.post("/login", userController.login_post);

router.get("/log-out", userController.log_out_get);

router.get("/sign-up", userController.sign_up_get);
router.post("/sign-up", userController.sign_up_post);

router.get("/join-club", userController.join_club_get);
router.post("/join-club", userController.join_club_post);

module.exports = router;
