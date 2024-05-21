const { Sequelize } = require("sequelize");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingName = await Admin.findOne({ where: { username } });
    if (existingName) {
      return res.status(403).json({ msg: "Username already exists" });
    }

    const user = await Admin.create({ username, password });
    res.status(201).send({ user });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Admin.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (user.password !== password) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1h" });
    res.status(200).send({ user, token });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const list = async (req, res) => {
  try {
    // const currentUserId = req.user.id;
    const users = await Admin.findAll({});
    res.status(200).send({ users });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

const searchUsers = async (req, res) => {
  try {
    const search = req.query.search;
    const regex = `%${search}%`; // For LIKE query in Sequelize

    const users = await Admin.findAll({
      where: {
        username: {
          [Sequelize.Op.like]: regex,
        },
      },
      attributes: {
        exclude: ["id"],
      },
    });

    return res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { signup, login, list, searchUsers };
