//create a middleware to check if the token is valid
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const authenticateSocket = async (socket, next) => {
  try {
    //get the token from the header
    const authHeader = socket.handshake.headers["authorization"];
    if (!authHeader) {
      socket.disconnect();
      return next(new Error("Unauthenticated"));
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"
    //check if no token
    if (!token) {
      socket.disconnect();
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    //verify token
    const decoded = jwt.verify(token, "secret");
    const user = await Admin.findOne({ where: { id: decoded.id } });
    console.log(user);
    socket.user = user;
    next();
  } catch (err) {
    socket.disconnect();
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authenticateSocket;
