const { texts } = require("../../../utils/texts")
const { customResponse } = require("../../../utils/customResponse")

const Service = require("../services")
const Validations = require("../validations")

module.exports.getAll = async (req, res) => {
  const data = await Validations.getAll({
    userId: req.userId,
    ...req.query,
  })

  const response = await Service.getAll(data)

  res.status(200).json(customResponse(texts.organizations, response))
}

module.exports.getOne = async (req, res) => {
  const data = await Validations.checkOne({
    userId: req.userId,
    ...req.params,
  })

  const response = await Service.getOne(data)

  res.status(200).json(customResponse(texts.organizations, response))
}

module.exports.deleteOne = async (req, res) => {
  const data = await Validations.checkOne({
    userId: req.userId,
    ...req.params,
  })

  const response = await Service.deleteOne(data)

  res.status(200).json(customResponse(texts.organizations, response))
}

module.exports.getUsers = async (req, res) => {
  const data = await Validations.getUsers({
    userId: req.userId,
    organizationId: req.organizationId,
  })

  const response = await Service.getUsers(data)

  res.status(200).json(customResponse(texts.users, response))
}

module.exports.removeUser = async (req, res) => {
  const data = await Validations.removeUser({
    userId: req.userId,
    organizationId: req.organizationId,
    ...req.params,
  })

  const response = await Service.removeUser(data)

  res.status(200).json(customResponse(texts.userDeleted, response))
}

module.exports.getMetadata = async (req, res) => {
  const data = await Validations.getMetadata({
    userId: req.userId,
    organizationId: req.organizationId,
    ...req.query,
  })

  const response = await Service.getMetadata(data)

  res.status(200).json(customResponse(texts.organizations, response))
}
