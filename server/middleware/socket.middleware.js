//create a middleware to check if the token is valid
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const authenticateSocket = async (socket, next) => {
  try {
    // Get the token from the auth object
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("No token, authorization denied"));
    }

    //verify token
    const decoded = jwt.verify(token, "secret");
    const user = await Admin.findOne({ where: { id: decoded.id } });
    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Token is not valid"));
  }
};

module.exports = authenticateSocket;
