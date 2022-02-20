const { parseError } = require("../utils/helpers")
const { CustomResponse } = require("../utils/CustomResponse")

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
    res.status(400).send(CustomResponse("Invalid request", null, false))
  })

  app.use((error, req, res, next) => {
    const { message, status, name, data } = parseError(error)

    if (name == "CustomError") {
      res.status(error.status).send(CustomResponse(message, data, false))
    } else if (name == "MongoError" && status == 11000) {
      const field = Object.entries(keyValue)[0][0] // Catch duplicate key field error
      res
        .status(400)
        .send(CustomResponse(`${field} already exists`, null, false))
    } else if (errorNames.includes(name)) {
      res.status(400).send(CustomResponse(message, null, false))
    } else {
      res.status(500).send(CustomResponse(message, null, false))
    }
  })

  return app
}
