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
    rest.pagination = {
      totalData: data.totalData,
      totalPages: data.totalPages,
      page: data.page,
      limit: data.limit,
    }

    if (data.response) {
      data = data.response
    }
  }

  return {
    status: status,
    message: formatMesaage(message),
    data: data || null,
    ...rest,
  }
}
