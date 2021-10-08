const Validations = require("../validations")
const AuthService = require("../services/auth")
const CustomerResponse = require("../utils/response")

class AuthContoller {
  async register(req, res) {
    const data = await Validations.user.register(req.body)

    const response = await AuthService.register(data)

    res.status(201).json(CustomerResponse(Texts.texts.userCreated, response))
  }

  async login(req, res) {
    const data = await Validations.user.login(req.body)

    const response = await AuthService.login(data)

    res.status(200).json(CustomerResponse(Texts.texts.loginSuccess, response))
  }

  async verifyEmailRequest(req, res) {
    const data = await Validations.user.checkEmail({
      email: req.params.email,
    })

    const response = await AuthService.verifyEmailRequest(data)

    res
      .status(200)
      .json(CustomerResponse(Texts.texts.emailVerificationSent, response))
  }

  async verifyEmail(req, res) {
    const data = await Validations.user.checkToken({
      token: req.params.token,
    })

    const response = await AuthService.verifyEmail(data)

    res.status(200).json(CustomerResponse(Texts.texts.emailVerified, response))
  }

  async resetPasswordRequest(req, res) {
    const data = await Validations.user.checkEmail({
      email: req.params.email,
    })

    const response = await AuthService.resetPasswordRequest(data)

    res
      .status(200)
      .json(CustomerResponse(Texts.texts.emailVerificationSent, response))
  }

  async resetPassword(req, res) {
    const data = await Validations.user.resetPassword(req.body)

    const response = await AuthService.resetPassword(data)

    res
      .status(200)
      .json(CustomerResponse(Texts.texts.passwordSuccess, response))
  }
}

module.exports = new AuthContoller()
