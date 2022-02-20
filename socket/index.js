let io
let users = []

const { CustomError } = require("../utils/customError")

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
      },
    })
    return io
  },
  getIO: () => {
    if (!io) {
      throw new CustomError("Socket.io not initialized!")
    }
    return io
  },
  getUsers: () => {
    return users
  },
  getUser: (socketId) => {
    const user = users.find((user) => user.id === socketId)
    return user
  },
  getUserById: (userId) => {
    const user = users.find((user) => String(user.userId) === String(userId))
    return user
  },
  addUser: (socket) => {
    users.push({
      id: socket.id,
      userId: socket.handshake.query.userId,
      socket,
    })
    return users
  },
  deleteUser: (socket) => {
    users = users.filter((user) => user.id !== socket.id)
    return users
  },
}
