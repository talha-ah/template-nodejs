require("express-async-errors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const Colors = require("./utils/Colors");

// Load env vars
dotenv.config({ path: ".env.dev" });

// App initialization
const app = express();

// Pre-route middlewares
require("./middlewares/pre-route")(app);

// API routes
app.use("/api", require("./routes"));

// Ping route for testing connection
app.get("/ping", (req, res) => res.status(200).send("Hello world!"));

// Error middlewares
require("./middlewares/error")(app);

// PORT Handling
const PORT = process.env.PORT || 8080;

// Connecting to Database and listening to server
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    const server = app.listen(PORT, () => {
      console.log(Colors.Reset, Colors.FgMagenta, `App listening: ${PORT}`);
    });
    const IOImport = require("./socket/socket");
    const io = IOImport.init(server);
    io.on("connection", (socket) => {
      console.log(
        Colors.FgMagenta,
        "Connection Established, Total = ",
        IOImport.addUser(socket).length
      );

      socket.on("disconnect", () => {
        console.log(
          Colors.FgRed,
          "Connection Demolished, Total = ",
          IOImport.deleteUser(socket).length
        );
      });
    });
  })
  .catch((err) => {
    console.log("[App.Mongoose]", err);
  });
