const ENV = process.env

const TokenModel = require("../models/token")
const UserService = require("../../users/services")
const OrgService = require("../../organizations/services")

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

const getToken = async (data, throwError = true) => {
  const token = await TokenModel.findOne(data).lean()

  if (throwError && (!token || !token.email)) {
    throw new CustomError(errors.tokenInvalid, 400, {
      token: errors.tokenInvalid,
    })
  }

  return token
}

const createToken = async (data) => {
  let token = await getToken(data, false)

  // Check if token is unique
  let isUnique = false
  while (!isUnique) {
    token = create4DigitToken()
    const found = await getToken({ token }, false)
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

const deleteToken = async (data) => {
  await TokenModel.findOneAndDelete({
    token: data.token,
  })

  return
}

const loginResponse = async (user) => {
  delete user.password

  user.lastLoginAt = new Date()

  UserService.updateOne({
    userId: user._id,
    lastLoginAt: user.lastLoginAt,
  })

  const orgs = await OrgService.getAll({ userId: user._id })
  user.organization = orgs[0]
  user.organizations = orgs

  if (orgs.length < 1) {
    throw new CustomError(errors.noOrganization, 400)
  }

  const token = createJWT({ user })

  return {
    token: token,
    user,
  }
}

module.exports.login = async (data) => {
  // Check if user exists
  let user = await UserService.getOneByEmail(data.email)

  if (user.status === "inactive") {
    throw new CustomError(errors.accountInactive, 400)
  }

  const isCorrect = compareHash(data.password, user.password)
  if (!isCorrect) {
    throw new CustomError(errors.passwordInvalid, 400)
  }

  return loginResponse(user)
}

module.exports.register = async (data) => {
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

  const token = await createToken({
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

  return loginResponse(user)
}

module.exports.verifyEmailRequest = async (data) => {
  // Check if user exists
  let user = await UserService.getOneByEmail(data.email)

  if (user.status !== "pending") {
    throw new CustomError(errors.alreadyVerified, 400)
  }

  const token = await createToken({
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

module.exports.verifyEmail = async (data) => {
  const token = await getToken(data)

  const user = await UserService.updateOneByEmail({
    email: token.email,
    status: "active",
  })

  await deleteToken(data)

  // Send email
  const emailConfig = {
    to: user.email,
    subject: `Email verified - ${ENV.APP_NAME}`,
    body: emailTemplate({
      name: user.firstName,
      message: `Your email has been verified. If there is any issue, please contact us at <a href="mailto:${ENV.APP_EMAIL}">${ENV.APP_EMAIL}</a>`,
    }),
  }
  await emailService.send(emailConfig)

  return
}

module.exports.recoverPasswordRequest = async (data) => {
  // Check if user exists
  let user = await UserService.getOneByEmail(data.email)

  const token = await createToken({
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

module.exports.recoverPassword = async (data) => {
  const token = await getToken({ token: data.token })

  data.password = hash(data.password)

  const user = await UserService.updateOneByEmail({
    email: token.email,
    password: data.password,
  })

  await deleteToken(data)

  // Send email
  const emailConfig = {
    to: user.email,
    subject: `Password Updated - ${ENV.APP_NAME}`,
    body: emailTemplate({
      name: user.firstName,
      message: `Your password was updated successfully. If there is any issue, please contact us at <a href="mailto:${ENV.APP_EMAIL}">${ENV.APP_EMAIL}</a>`,
    }),
  }
  await emailService.send(emailConfig)

  return
}

module.exports.checkEmail = async (data) => {
  let user = await UserService.getOneByEmail(data.email, false)

  let exists = !!user

  return { exists, user }
}

module.exports.checkToken = async (data) => {
  const token = await getToken(data)

  const user = await UserService.getOneByEmail(token.email)

  delete user.password

  return user
}
