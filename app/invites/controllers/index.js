const { texts } = require("../../../utils/texts")
const { CustomResponse } = require("../../../utils/customResponse")

const Service = require("../services")
const Validations = require("../validations")

module.exports.getAll = async (req, res) => {
  const data = await Validations.getAll({
    userId: req.userId,
    organizationId: req.organizationId,
    ...req.query,
  })

  const response = await Service.getAll(data)

  res.status(200).json(CustomResponse(texts.invites, response))
}

module.exports.createOne = async (req, res) => {
  const data = await Validations.createOne({
    userId: req.userId,
    organizationId: req.organizationId,
    ...req.body,
  })

  const response = await Service.createOne(data)

  res.status(200).json(CustomResponse(texts.invites, response))
}

module.exports.deleteOne = async (req, res) => {
  const data = await Validations.invite({
    userId: req.userId,
    organizationId: req.organizationId,
    ...req.params,
  })

  const response = await Service.deleteOne(data)

  res.status(200).json(CustomResponse(texts.invites, response))
}

module.exports.checkInvite = async (req, res) => {
  const data = await Validations.checkInvite(req.params)

  const response = await Service.checkInvite(data)

  res.status(200).json(CustomResponse(texts.invites, response))
}

module.exports.acceptInvite = async (req, res) => {
  const data = await Validations.acceptInvite({ ...req.body, ...req.params })

  const response = await Service.acceptInvite(data)

  res.status(200).json(CustomResponse(texts.invites, response))
}

module.exports.rejectInvite = async (req, res) => {
  const data = await Validations.checkInvite(req.params)

  const response = await Service.rejectInvite(data)

  res.status(200).json(CustomResponse(texts.invites, response))
}

module.exports.resendInvite = async (req, res) => {
  const data = await Validations.invite({
    userId: req.userId,
    organizationId: req.organizationId,
    ...req.params,
  })

  const response = await Service.resendInvite(data)

  res.status(200).json(CustomResponse(texts.invites, response))
}
