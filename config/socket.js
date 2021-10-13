const IOImport = require("@socket")
const { log } = require("@utils/helpers")

function connect(server) {
  const io = IOImport.init(server)

  io.on("connection", (socket) => {
    log("Connection Established, Total = ", IOImport.addUser(socket).length)

    socket.on("disconnect", () => {
      log("Connection Demolished, Total = ", IOImport.deleteUser(socket).length)
    })
  })
}

module.exports = connect
