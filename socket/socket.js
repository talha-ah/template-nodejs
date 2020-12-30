const user = require("../models/user");

var io;
var users = [];

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
  getUsers: () => {
    return users;
  },
  getUser: (socketId) => {
    const user = users.find((user) => user.id === socketId);
    return user;
  },
  getUserById: (userId) => {
    const user = users.find((user) => String(user.userId) === String(userId));
    return user;
  },
  addUser: (socket) => {
    users.push({
      id: socket.id,
      userId: socket.handshake.query.userId,
      socket,
    });
    return users;
  },
  deleteUser: (socket) => {
    users = users.filter((user) => user.id !== socket.id);
    return users;
  },
};
