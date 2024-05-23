const express = require("express");
const {
  createChat,
  getUserChats,
  getChatDetails,
  addUserToChat,
  removeUserFromChat,
} = require("../controllers/chat");
const router = express.Router();

router.route("/").post(createChat);
router.route("/user/:userId").get(getUserChats);
router.route("/:chatId").get(getChatDetails);
router.route("/addUser").post(addUserToChat);
router.route("/removeUser").post(removeUserFromChat);

module.exports = router;
