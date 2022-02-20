const ENV = process.env
const dayjs = require("dayjs")

const { errors } = require("../../../utils/texts")
const { hash } = require("../../../utils/helpers")
const { emailService } = require("../../../utils/mail")
const { emailTemplate } = require("../../../template/email")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")
const UserService = require("../../users/services")
const OrgService = require("../../organizations/services")

class Service {
  async getAll(data) {
    // Check authorization
    await OrgService.isAdmin(data)

    let invites = await Model.find({
      organizationId: data.organizationId,
    }).lean()

    return invites
  }

  async createOne(data) {
    // Check authorization
    await OrgService.isAdmin(data)
    let organization = await OrgService.getOne(data)

    // Check if user already exists
    let user = await UserService.getOneByEmail(data.email, false)
    if (user) {
      let exists = await OrgService.checkUserExists({
        ...data,
        userId: user._id,
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
    if (invite)
      throw new CustomError(errors.alreadyInvited, 400, {
        email: errors.alreadyInvited,
      })

    // Create invite
    invite = await Model.create(data)

    // Send email
    await emailService.send({
      to: data.email,
      subject: `Invitation email - ${ENV.APP_NAME}`,
      body: emailTemplate({
        name: data.firstName,
        buttonText: "Accept Invite",
        url: `${process.env.CLIENT_URL}/accept-invite?token=${invite._id}`,
        message: `You have been invited to join ${organization.name}. Please click the link below to accept the invite.`,
      }),
    })

    // Return invites
    const invites = await this.getAll(data)

    return invites
  }

  async deleteOne(data) {
    // Check authorization
    await OrgService.isAdmin(data)

    await Model.findByIdAndDelete(data.token)

    const invites = await this.getAll(data)

    return invites
  }

  async deleteInvite(data) {
    await Model.findByIdAndDelete(data.token)

    return
  }

  async checkInvite(data) {
    // Check if invite already exists
    let invite = await Model.findById(data.token).lean()
    if (!invite) throw new CustomError(errors.invalidInvite, 400)

    const inviteHour = dayjs(invite.updatedAt)
    const nowHour = dayjs()
    const diff = nowHour.diff(inviteHour, "hour")

    if (diff > 24) throw new CustomError(errors.invalidInvite, 400)

    let user = await UserService.getOneByEmail(invite.email, false)
    if (user) {
      let exists = await OrgService.checkUserExists({
        ...data,
        userId: user._id,
      })
      if (exists)
        throw new CustomError(errors.userAlreadyExistsInOrganization, 400)

      await OrgService.addUser({
        role: "user",
        userId: user._id,
        organizationId: invite.organizationId,
      })

      await this.deleteInvite(data)

      return {
        userExists: true,
      }
    }

    return {
      ...invite,
      userExists: false,
    }
  }

  async acceptInvite(data) {
    // Check if invite already exists
    let invite = await Model.findById(data.token).lean()
    if (!invite) throw new CustomError(errors.invalidInvite, 400)

    const inviteHour = dayjs(invite.updatedAt)
    const nowHour = dayjs()
    const diff = nowHour.diff(inviteHour, "hour")

    if (diff > 24) throw new CustomError(errors.invalidInvite, 400)

    let organization = await OrgService.getOne({
      organizationId: invite.organizationId,
    })
    if (!organization) throw new CustomError(errors.organizationNotFound, 400)

    let user = await UserService.getOneByEmail(invite.email, false)
    if (user) {
      let exists = await OrgService.checkUserExists({
        userId: user._id,
        organizationId: organization._id,
      })
      if (exists)
        throw new CustomError(errors.userAlreadyExistsInOrganization, 400)

      await OrgService.addUser({
        role: "user",
        userId: user._id,
        organizationId: organization._id,
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

      await OrgService.addUser({
        role: "user",
        userId: user._id,
        organizationId: organization._id,
      })
    }

    await this.deleteInvite(data)

    // Send email
    const emailConfig = {
      to: user.email,
      subject: `Welcome - ${ENV.APP_NAME}`,
      body: emailTemplate({
        buttonText: "Login",
        name: invite.firstName,
        url: `${process.env.CLIENT_URL}/login`,
        message: `Welcome to ${ENV.APP_NAME}. You have been added to the ${organization.name}. You can now login to the app.`,
      }),
    }
    await emailService.send(emailConfig)

    return
  }

  async rejectInvite(data) {
    await this.deleteInvite(data)

    return
  }

  async resendInvite(data) {
    // Check authorization
    await OrgService.isAdmin(data)
    let organization = await OrgService.getOne(data)

    let invite = await Model.findById(data.token)
    if (!invite) throw new CustomError(errors.invalidInvite, 400)

    await invite.update({
      $set: {
        updatedAt: new Date(),
      },
    })

    // Send email
    await emailService.send({
      to: invite.email,
      subject: `Invitation email - ${ENV.APP_NAME}`,
      body: emailTemplate({
        name: invite.firstName,
        buttonText: "Accept Invite",
        url: `${process.env.CLIENT_URL}/accept-invite?token=${invite._id}`,
        message: `You have been invited to join ${organization.name}. Please click the link below to accept the invite.`,
      }),
    })

    return
  }
}

module.exports = new Service()
