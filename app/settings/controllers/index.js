const { texts } = require("../../../utils/texts")
const { customResponse } = require("../../../utils/response")

const Service = require("../services")
const Validations = require("../validations")

module.exports.getSettings = async (req, res) => {
  const data = await Validations.getSettings({
    userId: req.userId,
    organizationId: req.organizationId,
    ...req.params,
  })

  // const response = await Service.getSettings(data)

  res.status(200).json(customResponse(texts.settings, response))
}

module.exports.updateSettings = async (req, res) => {
  const data = await Validations.updateSettings({
    userId: req.userId,
    organizationId: req.organizationId,
    ...req.params,
    ...req.body,
  })

  // const response = await Service.updateSettings(data)

  res.status(200).json(customResponse(texts.settings, response))
}
