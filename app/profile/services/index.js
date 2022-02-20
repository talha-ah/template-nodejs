const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")
const { hash, compareHash } = require("../../../utils/helpers")

const UserService = require("../../users/services")
const OrgService = require("../../organizations/services")

class Service {
  async fetchProfile(data) {
    const user = await UserService.getOne(data)

    delete user.password

    return user
  }

  async updateProfile(data) {
    let user = await UserService.getOne(data)
    if (user.email !== data.email) {
      // Check if email exists
      await UserService.checkIsEmailUnique(data.email)
    }

    user = await UserService.updateOne(data)

    return user
  }

  async updatePassword(data) {
    if (data.oldPassword === data.password)
      throw new CustomError(errors.samePassword, 400, {
        password: errors.samePassword,
      })

    const user = await UserService.getOne(data)

    const check = compareHash(data.oldPassword, user.password)
    if (!check)
      throw new CustomError(errors.passwordOldInvalid, 400, {
        oldPassword: errors.passwordOldInvalid,
      })

    data.password = hash(data.password)

    await UserService.updateOne(data)

    return
  }

  async deactivateProfile(data) {
    await UserService.updateOne({
      userId: data.userId,
      status: "inactive",
    })

    await OrgService.deactivateUserOrganizations(data)

    return
  }

  async updateFcmToken(data) {
    await UserService.updateOne(data)

    return
  }
}

module.exports = new Service()
