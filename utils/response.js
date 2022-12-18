const { formatMesaage } = require("./helpers")

/**
 * Returns response object
 * @param {string} message Response message
 * @param {*} data Data to be returned
 * @param {boolean} success Status of the request
 */

module.exports.customResponse = (message, data, status) => {
  const rest = {}

  if (data) {
    if (data.totalData || data.totalPages || data.page || data.limit) {
      rest.pagination = {
        page: data.page,
        limit: data.limit,
        totalData: data.totalData,
        totalPages: data.totalPages,
      }
    }

    if (data.response) data = data.response
  }

  return {
    status: status,
    message: formatMesaage(message),
    data: data || null,
    ...rest,
  }
}
