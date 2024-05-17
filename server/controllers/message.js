const Admin = require("../models/admin");
const Chat = require("../models/chat");
const Message = require("../models/message");

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { senderId, content, chatId } = req.body;

    const message = await Message.create({
      senderId,
      content,
      chatId,
    });

    await Chat.update(
      { latestMessageId: message.id },
      { where: { id: chatId } }
    );

    res.status(201).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get messages for a chat
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await Message.findAll({
      where: { chatId },
      include: [
        {
          model: Admin,
          as: "sender",
          attributes: ["id", "username"],
        },
        {
          model: Admin,
          as: "readBy",
          attributes: ["id", "username"],
          through: { attributes: [] },
        },
      ],
    });
    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Mark a message as read
const markMessageAsRead = async (req, res) => {
  try {
    const { messageId, userId } = req.body;
    const message = await Message.findByPk(messageId);
    const user = await Admin.findByPk(userId);

    if (!message || !user) {
      return res.status(404).json({ msg: "Message or User not found" });
    }

    await message.addReadBy(user);
    res.status(200).json({ msg: "Message marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  sendMessage,
  getChatMessages,
  markMessageAsRead,
};
