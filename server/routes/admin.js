const express = require("express");
const { signup, login, list, searchUsers } = require("../controllers/admin");
const router = express.Router();

router.route("/").get(list);
router.route("/").post(signup);
router.route("/login").post(login);
router.route("/search").get(searchUsers);

module.exports = router;
