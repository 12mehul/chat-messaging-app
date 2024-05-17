const express = require("express");
const {
  sendMessage,
  getChatMessages,
  markMessageAsRead,
} = require("../controllers/message");
const router = express.Router();

router.route("/").post(sendMessage);
router.route("/chat/:chatId").get(getChatMessages);
router.route("/markAsRead").post(markMessageAsRead);

module.exports = router;
