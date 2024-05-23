const { Op } = require("sequelize");
const Message = require("../models/message");
const Admin = require("../models/admin");
const Chat = require("../models/chat");

// Create a new chat
const createChat = async (req, res) => {
  try {
    const { chatName, isGroupChat, users, groupAdmin } = req.body;

    // unique user IDs
    const uniqueUsers = [...new Set(users)];

    if (isGroupChat === false) {
      // Check if the chat already exists
      const userChats = await Chat.findAll({
        where: {
          isGroupChat: false,
        },
        include: [
          {
            model: Admin,
            as: "users",
            where: {
              id: {
                [Op.in]: uniqueUsers,
              },
            },
            through: {
              attributes: [],
            },
          },
        ],
      });

      const existingChat = userChats.find((chat) => {
        const chatUserIds = chat.users.map((user) => user.id);
        return (
          uniqueUsers.length === chatUserIds.length &&
          uniqueUsers.every((id) => chatUserIds.includes(id))
        );
      });

      if (existingChat) {
        return res.status(200).json({ msg: "Chat already exists" });
      }
    }

    // Create the chat
    const chat = await Chat.create({
      chatName,
      isGroupChat,
      groupAdminId: groupAdmin,
    });

    // Add users to the chat
    if (uniqueUsers && uniqueUsers.length > 0) {
      const usersToAdd = await Admin.findAll({
        where: {
          id: uniqueUsers,
        },
      });
      await chat.addUsers(usersToAdd);
    }

    res.status(201).json({ chat, msg: "Chat created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Get chats for a user
const getUserChats = async (req, res) => {
  try {
    const id = req.params.userId;
    const user = await Admin.findByPk(id, {
      include: {
        model: Chat,
        as: "chats",
        include: [
          {
            model: Admin,
            as: "users",
            attributes: ["id", "username"],
          },
          // {
          //   model: Message,
          //   as: "messages",
          //   include: [
          //     {
          //       model: Admin,
          //       as: "sender",
          //       attributes: ["id", "username"],
          //     },
          //   ],
          // },
          {
            model: Message,
            as: "latestMessage",
            attributes: ["id", "content", "chatId", "createdAt"],
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
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// single chat details
const getChatDetails = async (req, res) => {
  try {
    const id = req.params.chatId;
    const chat = await Chat.findByPk(id, {
      include: [
        {
          model: Admin,
          as: "users",
          attributes: ["id", "username"],
        },
      ],
    });

    if (!chat) {
      return res.status(404).json({ msg: "Chat not found" });
    }

    res.status(200).json(chat);
  } catch (error) {
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
    await Message.destroy({ where: { chatId } });

    res.status(200).json({ msg: "User removed from chat" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = {
  createChat,
  getUserChats,
  getChatDetails,
  addUserToChat,
  removeUserFromChat,
};
