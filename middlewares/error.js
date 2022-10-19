const { parseError } = require("../utils/helpers")
const { customResponse } = require("../utils/customResponse")

// Possible error names
const errorNames = [
  "CastError",
  "JsonWebTokenError",
  "ValidationError",
  "SyntaxError",
  "MongooseError",
  "MongoError",
]

module.exports = (app) => {
  app.use("*", (req, res) => {
    res.status(400).send(customResponse("Invalid request", null, false))
  })

  app.use((error, req, res, next) => {
    const { name, message, status } = parseError(error)

    if (name == "CustomError") {
      res.status(error.status).send(customResponse(message, null, false))
    } else if (name == "MongoError" && status == 11000) {
      const field = Object.entries(keyValue)[0][0] // Catch duplicate key field error
      res
        .status(400)
        .send(customResponse(`${field} already exists`, null, false))
    } else if (errorNames.includes(name)) {
      res.status(400).send(customResponse(message, null, false))
    } else {
      res.status(500).send(customResponse(message, null, false))
    }
  })

  return app
}
