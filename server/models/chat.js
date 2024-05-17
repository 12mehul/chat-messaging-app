const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const Chat = sequelize.define("Chat", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  chatName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isGroupChat: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Chat;
