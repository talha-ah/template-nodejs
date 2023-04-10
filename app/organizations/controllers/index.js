const { texts } = require("../../../utils/texts")
const { customResponse } = require("../../../utils/response")

const Service = require("../services")
const Validations = require("../validations")

module.exports.getMetadata = async (req, res) => {
  const data = await Validations.getMetadata({
    userId: req.userId,
    organizationId: req.organizationId,
    ...req.query,
  })

  const response = await Service.getMetadata(data)

  res.status(200).json(customResponse(texts.organizations, response))
}

module.exports.getAll = async (req, res) => {
  const data = await Validations.getAll({
    userId: req.userId,
    ...req.query,
  })

  const response = await Service.getAll(data)

  res.status(200).json(customResponse(texts.organizations, response))
}

module.exports.getOne = async (req, res) => {
  const data = await Validations.getOne({
    userId: req.userId,
    ...req.params,
  })

  const response = await Service.getOne(data)

  res.status(200).json(customResponse(texts.organizations, response))
}

module.exports.createOne = async (req, res) => {
  let data = await Validations.createOne({
    userId: req.userId,
    ...req.body,
  })

  const response = await Service.createOne(data)

  res.status(200).json(customResponse(texts.organizations, response))
}

module.exports.updateOne = async (req, res) => {
  const data = await Validations.updateOne({
    userId: req.userId,
    organizationId: req.organizationId,
    ...req.body,
  })

  const response = await Service.updateOne(data)

  res.status(200).json(customResponse(texts.organizations, response))
}

module.exports.deactivateOne = async (req, res) => {
  const data = await Validations.getOne({
    userId: req.userId,
    ...req.params,
  })

  const response = await Service.deactivateOne(data)

  res.status(200).json(customResponse(texts.organizations, response))
}
