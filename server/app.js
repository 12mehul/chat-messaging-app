require("dotenv").config();
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const { sequelize } = require("./models");
const port = 5000;
const chats = require("./routes/chat");
const messages = require("./routes/message");
const admins = require("./routes/admin");
const authenticateSocket = require("./middleware/socket.middleware");

app.use(express.json());
app.use(express.static("./public"));
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
const io = new Server(server, {
  cors: {
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Use authentication middleware
io.use(authenticateSocket);

// Middleware to add socket.io to request
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.get("/node", (req, res) => res.send("Hello"));
app.use("/api/chats", chats);
app.use("/api/messages", messages);
app.use("/api/users", admins);

// Socket.io
io.on("connection", (socket) => {
  console.log("New connection:", socket.id);
  console.log("New user connected", socket.user.username);

  socket.on("joinChat", ({ chatId }) => {
    socket.join(chatId);
  });

  socket.on("newMessage", (newMessage) => {
    io.emit("messageReceived", {
      newMessage,
      user: socket.user.username,
    });
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const startConnection = async () => {
  try {
    await sequelize.sync();
    console.log("Database Connection Successful...");
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.log("Unable to connect to the database:", err);
  }
};
startConnection();
