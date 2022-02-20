const { texts } = require("../../../utils/texts")
const { CustomResponse } = require("../../../utils/CustomResponse")

const Service = require("../services")
const Validations = require("../validations")

class Contoller {
  async checkEmail(req, res) {
    const data = await Validations.checkEmail(req.params)

    const response = await Service.checkEmail(data)

    res.status(200).json(CustomResponse(texts.userCreated, response))
  }

  async checkToken(req, res) {
    const data = await Validations.checkToken(req.params)

    const response = await Service.checkToken(data)

    res.status(200).json(CustomResponse(texts.userCreated, response))
  }

  async register(req, res) {
    const data = await Validations.register(req.body)

    const response = await Service.register(data)

    res.status(200).json(CustomResponse(texts.userCreated, response))
  }

  async login(req, res) {
    const data = await Validations.login(req.body)

    const response = await Service.login(data)

    res.status(200).json(CustomResponse(texts.loginSuccess, response))
  }

  async verifyEmailRequest(req, res) {
    const data = await Validations.checkEmail(req.params)

    const response = await Service.verifyEmailRequest(data)

    res.status(200).json(CustomResponse(texts.emailVerificationSent, response))
  }

  async verifyEmail(req, res) {
    const data = await Validations.checkToken(req.params)

    const response = await Service.verifyEmail(data)

    res.status(200).json(CustomResponse(texts.emailVerified, response))
  }

  async resetPasswordRequest(req, res) {
    const data = await Validations.checkEmail(req.params)

    const response = await Service.resetPasswordRequest(data)

    res.status(200).json(CustomResponse(texts.emailVerificationSent, response))
  }

  async resetPassword(req, res) {
    const data = await Validations.resetPassword({ ...req.params, ...req.body })

    const response = await Service.resetPassword(data)

    res.status(200).json(CustomResponse(texts.passwordSuccess, response))
  }
}

module.exports = new Contoller()
