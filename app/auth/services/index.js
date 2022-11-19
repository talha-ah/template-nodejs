const ENV = process.env
const ObjectId = require("mongodb").ObjectId

const TokenModel = require("../models/token")
const UserService = require("../../users/services")
const OrgService = require("../../organizations/services")

const { errors } = require("../../../utils/texts")
const { emailService } = require("../../../utils/mail")
const { emailTemplate } = require("../../../template/email")
const { CustomError } = require("../../../utils/customError")
const { hash, createJWT, compareHash } = require("../../../utils/helpers")

const getToken = async (data, throwError = true) => {
  const token = await TokenModel.findById(data.token).lean()

  if (throwError && (!token || !token.email)) {
    throw new CustomError(errors.tokenInvalid, 400)
  }

  return token
}

const createToken = async (data) => {
  const token = await TokenModel.findOneAndUpdate(
    {
      email: data.email,
    },
    {
      $set: {
        type: data.type,
      },
    },
    { new: true, upsert: true }
  )
  if (!token) throw new CustomError(errors.error, 400)

  return token
}

const createRefreshToken = async (data) => {
  const token = await TokenModel.findOneAndUpdate(
    {
      type: "refresh-token",
      email: data.user.email,
      organizationId: data.user.organization._id,
    },
    {
      $set: {},
    },
    { new: true, upsert: true }
  ).lean()
  if (!token) throw new CustomError(errors.error, 400)

  return String(token._id)
}

const deleteToken = async (data) => {
  await TokenModel.findByIdAndDelete(data.token)

  return
}

module.exports.loginResponse = async (user, orgId) => {
  delete user.password

  user.lastLogin = new Date()

  UserService.updateOne({
    userId: user._id,
    lastLogin: user.lastLogin,
  })

  const organizations = await OrgService.getAll({ userId: user._id })
  if (organizations.length < 1) {
    throw new CustomError(errors.noOrganization, 400)
  }

  user.organizations = organizations
  user.organization = organizations[0]

  if (orgId) {
    const organization = organizations.find(
      (org) => String(org._id) === String(orgId)
    )
    if (organization) user.organization = organization
  }

  user.role = user.organization.role
  user.owner = user.organization.owner
  user.permissions = await OrgService.getUserPermissions({
    userId: user._id,
    organizationId: user.organization._id,
  })

  const accessToken = createJWT({ user })

  const refreshToken = await createRefreshToken({ user })

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    user,
  }
}

module.exports.authProfile = async (data) => {
  const user = await UserService.getOne({
    userId: data.userId,
  })

  const response = await this.loginResponse(user, data.organizationId)

  return response
}

module.exports.switchOrganization = async (data) => {
  const user = await UserService.getOne({
    userId: data.userId,
  })

  const response = await this.loginResponse(user, data.organizationId)

  return response
}

module.exports.login = async (data) => {
  // Check if user exists
  const user = await UserService.getOneByEmail(data.email)

  if (user.status === "inactive") {
    throw new CustomError(errors.accountInactive, 400)
  }

  const isCorrect = compareHash(data.password, user.password)
  if (!isCorrect) {
    throw new CustomError(errors.passwordInvalid, 400)
  }

  const response = await this.loginResponse(user)

  return response
}

module.exports.refreshToken = async (data) => {
  const token = await TokenModel.findOne({
    _id: ObjectId(data.refresh_token),
    type: "refresh-token",
  }).lean()
  if (!token) {
    throw new CustomError(errors.tokenInvalid, 400)
  }

  // Check if user exists
  const user = await UserService.getOneByEmail(token.email)

  if (user.status === "inactive") {
    throw new CustomError(errors.accountInactive, 400)
  }

  const response = await this.loginResponse(user, token.organizationId)

  return response
}

module.exports.register = async (data) => {
  // Check if email exists
  await UserService.checkIsEmailUnique(data.email)

  // Hash password
  data.password = hash(data.password)

  // Create User
  const user = await UserService.createOne(data)

  // Create organization
  await OrgService.createOne({
    name: data.firstName,
    email: data.email,
    users: [{ userId: user._id, role: "admin", owner: true }],
  })

  const token = await createToken({
    email: data.email,
    type: "verify-email",
  })

  // Send email
  emailService.send({
    to: data.email,
    subject: `Verify your email - ${ENV.APP_NAME}`,
    body: emailTemplate({
      name: user.firstName,
      button: "Verify Email",
      url: `${ENV.CLIENT_URL}/auth/verify-email?token=${token._id}`,
      message: `Thanks for signing up! Please verify your email address by clicking on the following button or copy and paste the following url in your browser:<br /><br /><a target="_blank" href=${ENV.CLIENT_URL}/auth/verify-email?token=${token._id}>${ENV.CLIENT_URL}/auth/verify-email?token=${token._id}</a>`,
    }),
  })

  const response = await this.loginResponse(user)

  return response
}

module.exports.verifyEmailRequest = async (data) => {
  // Check if user exists
  const user = await UserService.getOneByEmail(data.email)

  if (user.status !== "pending") {
    throw new CustomError(errors.alreadyVerified, 400)
  }

  const token = await createToken({
    email: data.email,
    type: "verify-email",
  })

  // Send email
  await emailService.send({
    to: data.email,
    subject: `Verify your email - ${ENV.APP_NAME}`,
    body: emailTemplate({
      name: user.firstName,
      button: "Verify Email",
      url: `${ENV.CLIENT_URL}/auth/verify-email?token=${token._id}`,
      message: `Please verify your email address by clicking on the following button or copy and paste the following url in your browser:<br /><br /><a target="_blank" href=${ENV.CLIENT_URL}/auth/verify-email?token=${token._id}>${ENV.CLIENT_URL}/auth/verify-email?token=${token._id}</a>`,
    }),
  })

  return
}

module.exports.verifyEmail = async (data) => {
  const token = await getToken(data)

  const user = await UserService.updateOneByEmail({
    email: token.email,
    status: "active",
  })

  await deleteToken(data)

  // Send email
  emailService.send({
    to: user.email,
    subject: `Email verified - ${ENV.APP_NAME}`,
    body: emailTemplate({
      button: "Sign in",
      name: user.firstName,
      url: `${ENV.CLIENT_URL}/auth/login`,
      message: `Your email has been verified. You can sign in to your account by clicking on the following button or copy and paste the following url in your browser:<br /><br /><a target="_blank" href=${ENV.CLIENT_URL}/auth/login>${ENV.CLIENT_URL}/auth/login</a>`,
    }),
  })

  return
}

module.exports.forgotPassword = async (data) => {
  // Check if user exists
  const user = await UserService.getOneByEmail(data.email)

  const token = await createToken({
    email: data.email,
    type: "recover-password",
  })

  // Send email
  await emailService.send({
    to: data.email,
    subject: `Recover your password - ${ENV.APP_NAME}`,
    body: emailTemplate({
      name: user.firstName,
      button: "Reset Password",
      url: `${ENV.CLIENT_URL}/auth/recover-password?token=${token._id}`,
      message: `Please click on the following button or copy and paste the following url in your browser to reset your password:<br /><br /><a target="_blank" href=${ENV.CLIENT_URL}/auth/recover-password?token=${token._id}>${ENV.CLIENT_URL}/auth/recover-password?token=${token._id}</a>`,
    }),
  })

  return
}

module.exports.recoverPassword = async (data) => {
  const token = await getToken(data)

  data.password = hash(data.password)

  const user = await UserService.updateOneByEmail({
    email: token.email,
    password: data.password,
  })

  await deleteToken(data)

  // Send email
  emailService.send({
    to: user.email,
    subject: `Reset Password - ${ENV.APP_NAME}`,
    body: emailTemplate({
      button: "Sign in",
      name: user.firstName,
      url: `${ENV.CLIENT_URL}/auth/login`,
      message: `Your password has been updated successfully. If this wasn't you or is there any issue, please contact us at <a href="mailto:${ENV.APP_EMAIL}">${ENV.APP_EMAIL}</a>`,
    }),
  })

  return
}

module.exports.checkEmail = async (data) => {
  const user = await UserService.getOneByEmail(data.email, false)

  const exists = !!user

  return { exists, user }
}

module.exports.checkToken = async (data) => {
  const token = await getToken(data)

  const user = await UserService.getOneByEmail(token.email)

  delete user.password

  return user
}
