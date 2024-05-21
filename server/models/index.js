const sequelize = require("../db/db");
const Admin = require("./admin");
const Chat = require("./chat");
const Message = require("./message");

// Define associations
// Many-to-Many Relationship: Admin and Chat
Admin.belongsToMany(Chat, { through: "ChatUsers", as: "chats" });
Chat.belongsToMany(Admin, { through: "ChatUsers", as: "users" });

// One-to-Many Relationship: Chat and Message
Chat.hasMany(Message, { foreignKey: "chatId", as: "messages" });
Message.belongsTo(Chat, { foreignKey: "chatId", as: "chat" });

// One-to-Many Relationship: Admin and Message
Admin.hasMany(Message, { foreignKey: "senderId", as: "messages" });
Message.belongsTo(Admin, { foreignKey: "senderId", as: "sender" });

// Many-to-Many Relationship: Message and Admin for Read Status
Message.belongsToMany(Admin, { through: "MessageReadBy", as: "readBy" });

// One-to-Many Relationship: Chat and Group Admin
Chat.belongsTo(Admin, { foreignKey: "groupAdminId", as: "groupAdmin" });

// One-to-One Relationship: Chat and Latest Message
Chat.belongsTo(Message, { foreignKey: "latestMessageId", as: "latestMessage" });

module.exports = {
  sequelize,
  Admin,
  Chat,
  Message,
};
