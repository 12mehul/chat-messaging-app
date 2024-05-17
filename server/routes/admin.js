const express = require("express");
const { signup, login, list } = require("../controllers/admin");
const router = express.Router();

router.route("/").get(list);
router.route("/").post(signup);
router.route("/login").post(login);

module.exports = router;
