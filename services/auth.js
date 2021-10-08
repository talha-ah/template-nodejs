const bcrypt = require("bcryptjs")
const JWT = require("jsonwebtoken")

const ENV = process.env
const EmailService = require("./mail")
const Texts = require("../utils/texts")
const UserModel = require("../models/user")
const EmailTemplate = require("../template/email")
const CustomError = require("../utils/customError")

class AuthService {
  async register(data) {
    let user = await UserModel.findOne({ email: data.email }).lean()
    if (user) throw new CustomError(Texts.errors.emailExists)

    data.password = bcrypt.hashSync(data.password, 32)

    user = await UserModel.create(data)

    const token = JWT.sign({ id: user._id }, ENV.JWT_SECRET)

    return {
      token: token,
    }
  }

  async login(data) {
    const user = await UserModel.findOne({ email: data.email }).lean()
    if (!user) throw new CustomError(Texts.errors.emailInvalid)

    const isCorrect = bcrypt.compareSync(data.password, user.password)
    if (!isCorrect) throw new CustomError(Texts.errors.passwordInvalid)

    const token = JWT.sign({ id: user._id }, ENV.JWT_SECRET)

    return {
      token: token,
    }
  }

  async verifyEmailRequest(data) {
    const user = await UserModel.findOne({ email: data.email }).lean()
    if (!user) throw new CustomError(Texts.errors.emailInvalid)
    if (user.isVerified) throw new CustomError(Texts.errors.alreadyVerified)

    const token = JWT.sign({ email: data.email }, ENV.JWT_SECRET)

    const url = `${ENV.CLIENT_URL}/email-verification/${token}`
    // Send email
    await EmailService.send({
      to: data.email,
      subject: `${ENV.APP_NAME} - Verify your email`,
      body: EmailTemplate({
        url: url,
        name: user.first_name,
        buttonText: "Verify Email",
        message: "Verify your email",
      }),
    })

    return
  }

  async verifyEmail(data) {
    const token = JWT.decode(data.token, ENV.JWT_SECRET)
    if (!token.email) throw new CustomError(Texts.errors.invalidToken)

    await UserModel.updateOne(
      { email: token.email },
      { $set: { isVerified: true } }
    )

    return
  }

  async resetPasswordRequest(data) {
    const user = await UserModel.findOne({ email: data.email }).lean()
    if (!user) throw new CustomError(Texts.errors.emailInvalid)

    const token = JWT.sign({ email: data.email }, ENV.JWT_SECRET)

    const url = `${url.CLIENT_URL}/reset-password/${token}`
    // Send email
    await EmailService.send({
      to: data.email,
      subject: `${ENV.APP_NAME} - Verify your email`,
      body: EmailTemplate({
        url: url,
        name: user.first_name,
        buttonText: "Reset Password",
        message: "Reset your password",
      }),
    })

    return
  }

  async resetPassword(data) {
    const token = JWT.decode(data.token, ENV.JWT_SECRET)
    if (!token.email) throw new CustomError(Texts.errors.invalidToken)

    data.password = bcrypt.hashSync(data.password, 32)

    await UserModel.updateOne(
      { email: token.email },
      { $set: { password: data.password } }
    )

    return
  }
}

module.exports = new AuthService()
