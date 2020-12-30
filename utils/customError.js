class CustomError extends Error {
  /**
   * Create custom error
   *
   * @param {*} message Error message for request response
   * @param {number} statusCode HTTP status code. Default is 500
   */
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.status = statusCode || 500;
  }
}

module.exports = CustomError;
