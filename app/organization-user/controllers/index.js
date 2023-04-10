const { texts } = require("../../../utils/texts")
const { customResponse } = require("../../../utils/response")

const Service = require("../services")
const Validations = require("../validations")

module.exports.getAll = async (req, res) => {
  const data = await Validations.getAll({
    userId: req.userId,
    organizationId: req.organizationId,
  })

  const response = await Service.getAll(data)

  res.status(200).json(customResponse(texts.users, response))
}

module.exports.updateMany = async (req, res) => {
  const data = await Validations.updateMany({
    userId: req.userId,
    organizationId: req.organizationId,
    ...req.params,
    ...req.body,
  })

  const response = await Service.updateMany(data)

  res.status(200).json(customResponse(texts.users, response))
}

module.exports.updateOne = async (req, res) => {
  const data = await Validations.updateOne({
    userId: req.userId,
    organizationId: req.organizationId,
    ...req.params,
    ...req.body,
  })

  const response = await Service.updateOne(data)

  res.status(200).json(customResponse(texts.users, response))
}

module.exports.removeOne = async (req, res) => {
  const data = await Validations.removeOne({
    userId: req.userId,
    organizationId: req.organizationId,
    ...req.params,
  })

  const response = await Service.removeOne(data)

  res.status(200).json(customResponse(texts.users, response))
}
