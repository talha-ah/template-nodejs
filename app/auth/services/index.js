const ENV = process.env

const { errors } = require("../../../utils/texts")
const { emailService } = require("../../../utils/mail")
const { emailTemplate } = require("../../../template/email")
const { CustomError } = require("../../../utils/customError")
const {
  hash,
  createJWT,
  compareHash,
  create4DigitToken,
} = require("../../../utils/helpers")

const TokenModel = require("../models/token")
const UserService = require("../../users/services")
const OrgService = require("../../organizations/services")

class Service {
  async checkEmail(data) {
    let user = await UserService.getOneByEmail(data.email, false)

    let exists = !!user

    return { exists, user }
  }

  async register(data) {
    // Check if email exists
    await UserService.checkIsEmailUnique(data.email)

    // Hash password
    data.password = hash(data.password)

    // Create User
    let user = await UserService.createOne(data)

    // Create organization
    await OrgService.createOne({
      name: data.firstName,
      email: data.email,
      users: [{ userId: user._id, role: "admin" }],
    })

    const token = await this.createToken({
      email: data.email,
      type: "verifyEmail",
    })

    // Send email
    await emailService.send({
      to: data.email,
      subject: `Verify your email - ${ENV.APP_NAME}`,
      body: emailTemplate({
        name: user.firstName,
        message: `Verification Code: ${token}`,
      }),
    })

    return
  }

  async login(data) {
    // Check if user exists
    let user = await UserService.getOneByEmail(data.email)

    if (user.status === "inactive") {
      throw new CustomError(errors.accountInactive, 400, {
        email: errors.accountInactive,
      })
    }

    const isCorrect = compareHash(data.password, user.password)
    if (!isCorrect)
      throw new CustomError(errors.passwordInvalid, 400, {
        password: errors.passwordInvalid,
      })

    delete user.password

    const orgs = await OrgService.getAll({ userId: user._id })
    user.organization = orgs[0]
    user.organizations = orgs

    const token = createJWT({ user })

    return {
      token: token,
      user,
    }
  }

  async verifyEmailRequest(data) {
    // Check if user exists
    let user = await UserService.getOneByEmail(data.email)

    if (user.status !== "pending") {
      throw new CustomError(errors.alreadyVerified, 400, {
        email: errors.alreadyVerified,
      })
    }

    const token = await this.createToken({
      email: data.email,
      type: "verifyEmail",
    })

    // Send email
    await emailService.send({
      to: data.email,
      subject: `Verify your email - ${ENV.APP_NAME}`,
      body: emailTemplate({
        name: user.firstName,
        message: `Verification Code: ${token}`,
      }),
    })

    return
  }

  async verifyEmail(data) {
    const token = await this.getToken(data)

    const user = await UserService.updateOneByEmail({
      email: token.email,
      status: "active",
    })

    await this.deleteToken(data)

    // Send email
    const emailConfig = {
      to: user.email,
      subject: `Email verified - ${ENV.APP_NAME}`,
      body: emailTemplate({
        name: user.firstName,
        message: `Your email has been verified. If there is any issue, please contact us at <a href="mailto:${ENV.MAILER_EMAIL}">${ENV.MAILER_EMAIL}</a>`,
      }),
    }
    await emailService.send(emailConfig)

    return
  }

  async resetPasswordRequest(data) {
    // Check if user exists
    let user = await UserService.getOneByEmail(data.email)

    const token = await this.createToken({
      email: data.email,
      type: "resetPassword",
    })

    // Send email
    await emailService.send({
      to: data.email,
      subject: `Change your password - ${ENV.APP_NAME}`,
      body: emailTemplate({
        name: user.firstName,
        message: `Verification Code: ${token}`,
      }),
    })

    return
  }

  async resetPassword(data) {
    const token = await this.getToken({ token: data.token })

    data.password = hash(data.password)

    const user = await UserService.updateOneByEmail({
      email: token.email,
      password: data.password,
    })

    await this.deleteToken(data)

    // Send email
    const emailConfig = {
      to: user.email,
      subject: `Password Updated - ${ENV.APP_NAME}`,
      body: emailTemplate({
        name: user.firstName,
        message: `Your password was updated successfully. If there is any issue, please contact us at <a href="mailto:${ENV.MAILER_EMAIL}">${ENV.MAILER_EMAIL}</a>`,
      }),
    }
    await emailService.send(emailConfig)

    return
  }

  async checkToken(data) {
    const token = await this.getToken(data)

    const user = await UserService.getOneByEmail(token.email)

    delete user.password

    return user
  }

  async getToken(data, throwError = true) {
    const token = await TokenModel.findOne(data).lean()

    if (throwError && (!token || !token.email)) {
      throw new CustomError(errors.tokenInvalid, 400, {
        token: errors.tokenInvalid,
      })
    }

    return token
  }

  async createToken(data) {
    let token = await this.getToken(data, false)

    // Check if token is unique
    let isUnique = false
    while (!isUnique) {
      token = create4DigitToken()
      const found = await this.getToken({ token }, false)
      if (!found) isUnique = true
    }

    token = await TokenModel.findOneAndUpdate(
      {
        email: data.email,
      },
      {
        $set: {
          token,
          type: data.type,
        },
      },
      { new: true, upsert: true }
    )
    if (!token) throw new CustomError(errors.error, 400)

    return token.token
  }

  async deleteToken(data) {
    await TokenModel.findOneAndDelete({
      token: data.token,
    })

    return
  }
}

module.exports = new Service()
