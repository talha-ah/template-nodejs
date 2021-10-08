const CustomError = require("../utils/customError")

export const handleError = ({ error, value }) => {
  if (error) {
    const { details } = error
    const message = details.map((i) => i.message).join(",")

    throw new CustomError(message, 405)
  }
  return value
}
