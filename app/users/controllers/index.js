const { texts } = require("../../../utils/texts")
const { customResponse } = require("../../../utils/customResponse")

const Service = require("../services")
const Validations = require("../validations")

module.exports.getAll = async (req, res) => {
  // const data = await Validations.getAll({
  //   userId: req.userId,
  //   organizationId: req.organizationId,
  //   ...req.query,
  // })

  const response = await Service.getAll(data)

  res.status(200).json(customResponse(texts.users, response))
}

module.exports.deleteOne = async (req, res) => {
  // const data = await Validations.getOne({
  //   userId: req.userId,
  //   organizationId: req.organizationId,
  //   ...req.params,
  // })

  const response = await Service.deleteOne(data)

  res.status(200).json(customResponse(texts.userDeleted, response))
}
