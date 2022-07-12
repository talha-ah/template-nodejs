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
app.use("/api/v1", require("./app"))

// Error middlewares
require("./middlewares/error")(app)

// PORT Handling
const PORT = process.env.PORT || "8080"
const ENV = process.env.NODE_ENV.toUpperCase()

// Connecting to Database and listening to server
;(async () => {
  try {
    await connectDB()
    const server = app.listen(PORT, () =>
      console.log(`${ENV} App started on port:`, PORT)
    )
    connectIO(server)
  } catch (err) {
    console.log("[App Error]", err)
  }
})()
