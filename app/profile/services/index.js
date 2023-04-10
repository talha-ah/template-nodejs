const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")
const { hash, compareHash } = require("../../../utils/helpers")

const UserService = require("../../users/services")
const OrgUserService = require("../../organization-user/services")

module.exports.fetchProfile = async (data) => {
  const user = await UserService.getOne(data)

  delete user.password

  return user
}

module.exports.updateProfile = async (data) => {
  let user = await UserService.getOne(data)

  if (user.email !== data.email) {
    // Check if email exists
    await UserService.checkIsEmailUnique(data.email)
  }

  user = await UserService.updateOne(data)

  return user
}

module.exports.updatePassword = async (data) => {
  if (data.oldPassword === data.password)
    throw new CustomError(errors.passwordSame, 400)

  const user = await UserService.getOne(data)

  const check = compareHash(data.oldPassword, user.password)
  if (!check) throw new CustomError(errors.passwordOldInvalid, 400)

  data.password = hash(data.password)

  await UserService.updateOne(data)

  return
}

module.exports.deactivateProfile = async (data) => {
  await UserService.updateOne({
    userId: data.userId,
    status: "inactive",
  })

  await OrgUserService.deactivateUserOrganizations(data)

  return
}

module.exports.updateFcmToken = async (data) => {
  await UserService.updateOne(data)

  return
}

module.exports.updateTheme = async (data) => {
  await UserService.updateOne(data)

  return
}
