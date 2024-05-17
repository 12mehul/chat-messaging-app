const Message = require("../models/message");
const Admin = require("../models/admin");
const Chat = require("../models/chat");

// Create a new chat
const createChat = async (req, res) => {
  try {
    const { chatName, isGroupChat, users, groupAdmin } = req.body;

    // Create the chat
    const chat = await Chat.create({
      chatName,
      isGroupChat,
      groupAdminId: groupAdmin,
    });

    // Add users to the chat
    if (users && users.length > 0) {
      const usersToAdd = await Admin.findAll({
        where: {
          id: users,
        },
      });
      await chat.addUsers(usersToAdd);
    }

    res.status(201).json({ chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get chats for a user
const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await Admin.findByPk(userId, {
      include: {
        model: Chat,
        as: "chats",
        include: [
          {
            model: Admin,
            as: "users",
            attributes: ["id", "username"],
          },
          {
            model: Message,
            as: "messages",
            include: [
              {
                model: Admin,
                as: "sender",
                attributes: ["id", "username"],
              },
            ],
          },
        ],
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(user.chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Add user to a chat
const addUserToChat = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const chat = await Chat.findByPk(chatId);
    const user = await Admin.findByPk(userId);

    if (!chat || !user) {
      return res.status(404).json({ msg: "Chat or User not found" });
    }

    await chat.addUser(user);
    res.status(200).json({ msg: "User added to chat" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Remove user from a chat
const removeUserFromChat = async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const chat = await Chat.findByPk(chatId);
    const user = await Admin.findByPk(userId);

    if (!chat || !user) {
      return res.status(404).json({ msg: "Chat or User not found" });
    }

    await chat.removeUser(user);
    res.status(200).json({ msg: "User removed from chat" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  createChat,
  getUserChats,
  addUserToChat,
  removeUserFromChat,
};
