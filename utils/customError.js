class CustomError extends Error {
  /**
   * Create custom error
   *
   * @param {*} message Error message for request response
   * @param {number} statusCode HTTP status code. Default is 500
   */
  constructor(message, statusCode, data) {
    super(message)
    this.name = this.constructor.name
    this.status = statusCode || 500
    this.data = data
  }
}

module.exports = {
  CustomError,
}
