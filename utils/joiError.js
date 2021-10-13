const { CustomError } = require("@utils/customError")

function joiError({ error, value }) {
  if (error) {
    const { details } = error
    const message = details.map((i) => i.message).join(",")

    throw new CustomError(message, 405)
  }
  return value
}

module.exports = {
  joiError,
}
