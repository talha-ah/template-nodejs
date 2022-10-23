const { texts } = require("../../../utils/texts")
const { customResponse } = require("../../../utils/customResponse")

const Service = require("../services")
const Validations = require("../validations")

module.exports.authProfile = async (req, res) => {
  const data = await Validations.authProfile({
    userId: req.userId,
    organizationId: req.organizationId,
  })

  const response = await Service.authProfile(data)

  res.status(200).json(customResponse(texts.loginSuccess, response))
}

module.exports.login = async (req, res) => {
  const data = await Validations.login(req.body)

  const response = await Service.login(data)

  res.status(200).json(customResponse(texts.loginSuccess, response))
}

module.exports.refreshToken = async (req, res) => {
  const data = await Validations.refreshToken(req.body)

  const response = await Service.refreshToken(data)

  res.status(200).json(customResponse(texts.refreshSuccess, response))
}

module.exports.register = async (req, res) => {
  const data = await Validations.register(req.body)

  const response = await Service.register(data)

  res.status(200).json(customResponse(texts.userCreated, response))
}

module.exports.verifyEmailRequest = async (req, res) => {
  const data = await Validations.checkEmail(req.body)

  const response = await Service.verifyEmailRequest(data)

  res.status(200).json(customResponse(texts.emailVerificationSent, response))
}

module.exports.verifyEmail = async (req, res) => {
  const data = await Validations.checkToken(req.params)

  const response = await Service.verifyEmail(data)

  res.status(200).json(customResponse(texts.emailVerified, response))
}

module.exports.forgotPassword = async (req, res) => {
  const data = await Validations.forgotPassword(req.body)

  const response = await Service.forgotPassword(data)

  res.status(200).json(customResponse(texts.emailVerificationSent, response))
}

module.exports.recoverPassword = async (req, res) => {
  const data = await Validations.recoverPassword({ ...req.params, ...req.body })

  const response = await Service.recoverPassword(data)

  res.status(200).json(customResponse(texts.passwordSuccess, response))
}

module.exports.checkEmail = async (req, res) => {
  const data = await Validations.checkEmail(req.params)

  const response = await Service.checkEmail(data)

  res.status(200).json(customResponse(texts.success, response))
}

module.exports.checkToken = async (req, res) => {
  const data = await Validations.checkToken(req.params)

  const response = await Service.checkToken(data)

  res.status(200).json(customResponse(texts.success, response))
}
