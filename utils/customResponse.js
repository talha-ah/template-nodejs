const { formatMesaage } = require("./helpers")

/**
 * Returns response object
 * @param {string} message Response message
 * @param {*} data Data to be returned
 * @param {boolean} success Status of the request
 */

function CustomResponse(message, data, success) {
  return {
    message: formatMesaage(message),
    data: data || null,
    success: success == null ? true : success,
  }
}

module.exports = {
  CustomResponse,
}
