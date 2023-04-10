const ENV = process.env

const dayjs = require("dayjs")

const { errors } = require("../../../utils/texts")
const { hash } = require("../../../utils/helpers")
const { emailService } = require("../../../utils/mail")
const { emailTemplate } = require("../../../template/email")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")
const AuthService = require("../../auth/services")
const UserService = require("../../users/services")
const OrgService = require("../../organizations/services")
const OrgUserService = require("../../organization-user/services")

const getInviteMessage = (organizationName, invite) => {
  return `You have been invited to join ${organizationName} on ${ENV.APP_NAME}. The invite will expire in 24 hours. Please accept this invite by clicking on the button below or copy and paste the following url in your browser:<br /><br /><a target="_blank" href=${process.env.CLIENT_URL}/auth/accept-invite?token=${invite._id}>${process.env.CLIENT_URL}/auth/accept-invite?token=${invite._id}</a>`
}

module.exports.getAll = async (data) => {
  const page = +data.page || 1
  const limit = +data.limit || +ENV.LIMIT

  const query = {
    organizationId: data.organizationId,
  }

  const response = await Model.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

  const totalData = await Model.find(query).countDocuments()

  return {
    page,
    limit,
    totalData,
    totalPages: Math.ceil(totalData / limit),
    response,
  }
}

module.exports.createOne = async (data) => {
  const organization = await OrgService.getOne(data)

  // Check if user already exists
  let user = await UserService.getOneByEmail(data.email, false)
  if (user) {
    const exists = await OrgUserService.checkUserExists({
      userId: user._id,
      organizationId: data.organizationId,
    })
    if (exists) {
      throw new CustomError(errors.userAlreadyExistsInOrganization, 400)
    }
  }

  // Check if invite already exists
  let invite = await Model.findOne({
    email: data.email,
    organizationId: data.organizationId,
  })
  if (invite) throw new CustomError(errors.alreadyInvited, 400)

  // Create invite
  invite = await Model.create(data)

  // Send email
  await emailService.send({
    to: data.email,
    subject: `Invitation email - ${ENV.APP_NAME}`,
    body: emailTemplate({
      name: data.firstName,
      button: "Accept Invite",
      message: getInviteMessage(organization.name, invite),
      url: `${process.env.CLIENT_URL}/auth/accept-invite?token=${invite._id}`,
    }),
  })

  return invite
}

module.exports.deleteOne = async (data) => {
  await Model.findByIdAndDelete(data.token)

  return
}

module.exports.deleteInviteWithoutAuth = async (data) => {
  // Delete invite without checking authorization
  await Model.findByIdAndDelete(data.token)

  return
}

module.exports.checkInvite = async (data) => {
  // Check if invite already exists
  const invite = await Model.findById(data.token).lean()
  if (!invite) throw new CustomError(errors.invalidInvite, 400)

  const inviteHour = dayjs(invite.updatedAt)
  const nowHour = dayjs()
  const diff = nowHour.diff(inviteHour, "hour")

  if (diff > 24) throw new CustomError(errors.invalidInvite, 400)

  let userExists = false

  let user = await UserService.getOneByEmail(invite.email, false)
  if (user) {
    // Add user to the organization if he/she already exists
    userExists = true

    let exists = await OrgUserService.checkUserExists({
      userId: user._id,
      organizationId: invite.organizationId,
    })
    if (exists) {
      throw new CustomError(errors.userAlreadyExistsInOrganization, 400)
    }

    await OrgUserService.addUser({
      role: "user",
      userId: user._id,
      organizationId: invite.organizationId,
    })

    await this.deleteInviteWithoutAuth(data)
  }

  return {
    ...invite,
    userExists,
  }
}

module.exports.acceptInvite = async (data) => {
  // Check if invite already exists
  const invite = await Model.findById(data.token).lean()
  if (!invite) throw new CustomError(errors.invalidInvite, 400)

  const inviteHour = dayjs(invite.updatedAt)
  const nowHour = dayjs()
  const diff = nowHour.diff(inviteHour, "hour")

  if (diff > 24) throw new CustomError(errors.invalidInvite, 400)

  const organization = await OrgService.getOne({
    organizationId: invite.organizationId,
  })
  if (!organization) throw new CustomError(errors.organizationNotFound, 400)

  let user = await UserService.getOneByEmail(invite.email, false)
  if (user) {
    let exists = await OrgUserService.checkUserExists({
      userId: user._id,
      organizationId: invite.organizationId,
    })
    if (exists) {
      throw new CustomError(errors.userAlreadyExistsInOrganization, 400)
    }

    await OrgUserService.addUser({
      role: "user",
      userId: user._id,
      organizationId: invite.organizationId,
    })
  } else {
    // Hash password
    data.password = hash(data.password)

    // Create User
    user = await UserService.createOne({
      status: "active",
      email: invite.email,
      password: data.password,
      lastName: invite.lastName,
      firstName: invite.firstName,
    })

    // Create user own organization
    await OrgUserService.createOne({
      email: invite.email,
      name: invite.firstName,
    })

    await OrgUserService.addUser({
      role: "user",
      userId: user._id,
      organizationId: invite.organizationId,
    })
  }

  await this.deleteInviteWithoutAuth(data)

  const loginResponse = await AuthService.loginResponse(
    user,
    invite.organizationId
  )

  emailService.send({
    to: user.email,
    subject: `Welcome - ${ENV.APP_NAME}`,
    body: emailTemplate({
      button: "Login",
      name: invite.firstName,
      url: `${process.env.CLIENT_URL}/auth/login`,
      message: `Welcome to ${ENV.APP_NAME}. You have been added to the ${organization.name}. You can now login to the app.`,
    }),
  })

  return loginResponse
}

module.exports.rejectInvite = async (data) => {
  await this.deleteInviteWithoutAuth(data)

  return
}

module.exports.resendInvite = async (data) => {
  const organization = await OrgService.getOne(data)

  // TODO: Delete and create new invite
  const invite = await Model.findByIdAndUpdate(
    data.token,
    {
      $set: {
        updatedAt: new Date(),
      },
    },
    {
      new: true,
    }
  ).lean()
  if (!invite) throw new CustomError(errors.invalidInvite, 400)

  // Send email
  await emailService.send({
    to: invite.email,
    subject: `Invitation email - ${ENV.APP_NAME}`,
    body: emailTemplate({
      name: invite.firstName,
      button: "Accept Invite",
      message: getInviteMessage(organization.name, invite),
      url: `${process.env.CLIENT_URL}/auth/accept-invite?token=${invite._id}`,
    }),
  })

  return
}
