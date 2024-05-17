const sequelize = require("../db/db");
const Admin = require("./admin");
const Chat = require("./chat");
const Message = require("./message");

// Define associations
Admin.belongsToMany(Chat, { through: "ChatUsers", as: "chats" });
Chat.belongsToMany(Admin, { through: "ChatUsers", as: "users" });

Chat.hasMany(Message, { foreignKey: "chatId", as: "messages" });
Message.belongsTo(Chat, { foreignKey: "chatId", as: "chat" });

Admin.hasMany(Message, { foreignKey: "senderId", as: "messages" });
Message.belongsTo(Admin, { foreignKey: "senderId", as: "sender" });
Message.belongsToMany(Admin, { through: "MessageReadBy", as: "readBy" });

Chat.belongsTo(Admin, { foreignKey: "groupAdminId", as: "groupAdmin" });

module.exports = {
  sequelize,
  Admin,
  Chat,
  Message,
};
