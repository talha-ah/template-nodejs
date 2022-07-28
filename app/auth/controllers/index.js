const { texts } = require("../../../utils/texts")
const { CustomResponse } = require("../../../utils/customResponse")

const Service = require("../services")
const Validations = require("../validations")

module.exports.login = async (req, res) => {
  const data = await Validations.login(req.body)

  const response = await Service.login(data)

  res.status(200).json(CustomResponse(texts.loginSuccess, response))
}

module.exports.register = async (req, res) => {
  const data = await Validations.register(req.body)

  const response = await Service.register(data)

  res.status(200).json(CustomResponse(texts.userCreated, response))
}

module.exports.verifyEmailRequest = async (req, res) => {
  const data = await Validations.checkEmail(req.params)

  const response = await Service.verifyEmailRequest(data)

  res.status(200).json(CustomResponse(texts.emailVerificationSent, response))
}

module.exports.verifyEmail = async (req, res) => {
  const data = await Validations.checkToken(req.params)

  const response = await Service.verifyEmail(data)

  res.status(200).json(CustomResponse(texts.emailVerified, response))
}

module.exports.recoverPasswordRequest = async (req, res) => {
  const data = await Validations.checkEmail(req.params)

  const response = await Service.recoverPasswordRequest(data)

  res.status(200).json(CustomResponse(texts.emailVerificationSent, response))
}

module.exports.recoverPassword = async (req, res) => {
  const data = await Validations.recoverPassword({ ...req.params, ...req.body })

  const response = await Service.recoverPassword(data)

  res.status(200).json(CustomResponse(texts.passwordSuccess, response))
}

module.exports.checkEmail = async (req, res) => {
  const data = await Validations.checkEmail(req.params)

  const response = await Service.checkEmail(data)

  res.status(200).json(CustomResponse(texts.userCreated, response))
}

module.exports.checkToken = async (req, res) => {
  const data = await Validations.checkToken(req.params)

  const response = await Service.checkToken(data)

  res.status(200).json(CustomResponse(texts.userCreated, response))
}
