require("colors")
require("express-async-errors")
const dotenv = require("dotenv")
const express = require("express")

// Load env vars
dotenv.config({ path: ".env" })

// App initialization
const app = express()

// Imports
const connectDB = require("./config/db")
const connectIO = require("./config/socket")

// Pre-route middlewares
require("./middlewares/pre-route")(app)

// Ping app for testing connection
app.get("/ping", (req, res) => res.status(200).send("Hello world!"))

// API routes
require("./app")(app)

// Error middlewares
require("./middlewares/error")(app)

// PORT Handling
const PORT = process.env.PORT || 8080

// Connecting to Database and listening to server
connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`App listening at port:`, String(PORT).yellow)
    })
    connectIO(server)
  })
  .catch((err) => {
    console.log("[App Error]", err)
  })
