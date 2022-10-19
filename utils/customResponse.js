const { formatMesaage } = require("./helpers")

/**
 * Returns response object
 * @param {string} message Response message
 * @param {*} data Data to be returned
 * @param {boolean} success Status of the request
 */

module.exports.customResponse = (message, data, success) => {
  const rest = {}

  if (data) {
    rest.totalData = data.totalData
    rest.totalPages = data.totalPages
    rest.page = data.page
    rest.limit = data.limit

    if (data.response) {
      data = data.response
    }
  }

  return {
    message: formatMesaage(message),
    data: data || null,
    success: success == null ? true : success,
    ...rest,
  }
}
