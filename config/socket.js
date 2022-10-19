const IOImport = require("../socket")

function connect(server) {
  const io = IOImport.init(server)

  io.on("connection", (socket) => {
    console.log("User connected, Total = ", IOImport.addUser(socket).length)

    socket.on("disconnect", () => {
      console.log(
        "User Disconnected, Total = ",
        IOImport.deleteUser(socket).length
      )
    })
  })
}

module.exports = connect
