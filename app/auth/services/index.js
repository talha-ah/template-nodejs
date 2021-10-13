const ENV = process.env
const { errors } = require("@utils/texts")
const { emailService } = require("@utils/mail")
const { emailTemplate } = require("@template/email")
const { CustomError } = require("@utils/customError")
const { sign, hash, decode, compareHash } = require("@utils/helpers")

const UserModel = require("../../users/models")

class Service {
  async register(data) {
    if (data.role === "admin" && data.secret !== ENV.ADMIN_SECRET) {
      throw new CustomError(errors.invalidSecret)
    }

    let user = await UserModel.findOne({ email: data.email }).lean()
    if (user) throw new CustomError(errors.emailExists)

    data.password = hash(data.password, 32)

    user = await UserModel.create(data)

    const token = sign({ email: data.email })

    const url = `${ENV.CLIENT_URL}/email-verification/${token}`

    // Send email
    await emailService.send({
      to: data.email,
      subject: `${ENV.APP_NAME} - Verify your email`,
      body: emailTemplate({
        url: url,
        name: user.firstName,
        buttonText: "Verify Email",
        message: "Verify your email",
      }),
    })

    return
  }

  async login(data) {
    const user = await UserModel.findOne({ email: data.email }).lean()

    if (!user) throw new CustomError(errors.emailInvalid)
    if (user.status === "inactive")
      throw new CustomError(errors.inactiveAccount)
    if (user.status === "pending")
      throw new CustomError(errors.pendingEmailVerification)

    const isCorrect = compareHash(data.password, user.password)
    if (!isCorrect) throw new CustomError(errors.passwordInvalid)

    const token = sign({ id: user._id })

    return {
      token: token,
    }
  }

  async verifyEmailRequest(data) {
    const user = await UserModel.findOne({ email: data.email }).lean()

    if (!user) throw new CustomError(errors.emailInvalid)
    if (user.status !== "pending") throw new CustomError(errors.alreadyVerified)

    const token = sign({ email: data.email })

    const url = `${ENV.CLIENT_URL}/email-verification/${token}`

    // Send email
    await emailService.send({
      to: data.email,
      subject: `${ENV.APP_NAME} - Verify your email`,
      body: emailTemplate({
        url: url,
        name: user.firstName,
        buttonText: "Verify Email",
        message: "Verify your email",
      }),
    })

    return
  }

  async verifyEmail(data) {
    const token = decode(data.token)
    if (!token.email) throw new CustomError(errors.invalidToken)

    await UserModel.updateOne(
      { email: token.email },
      { $set: { status: "active" } }
    )

    return
  }

  async resetPasswordRequest(data) {
    const user = await UserModel.findOne({ email: data.email }).lean()
    if (!user) throw new CustomError(errors.emailInvalid)

    const token = sign({ email: data.email })

    const url = `${url.CLIENT_URL}/reset-password/${token}`

    // Send email
    await emailService.send({
      to: data.email,
      subject: `${ENV.APP_NAME} - Verify your email`,
      body: emailTemplate({
        url: url,
        name: user.firstName,
        buttonText: "Reset Password",
        message: "Reset your password",
      }),
    })

    return
  }

  async resetPassword(data) {
    const token = decode(data.token)
    if (!token.email) throw new CustomError(errors.invalidToken)

    data.password = hash(data.password, 32)

    await UserModel.updateOne(
      { email: token.email },
      { $set: { password: data.password } }
    )

    return
  }
}

module.exports = new Service()
