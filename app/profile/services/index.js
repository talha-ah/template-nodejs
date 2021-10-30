const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")
const { hash, compareHash } = require("../../../utils/helpers")

const Model = require("../../users/models")

class Service {
  async fetchProfile(data) {
    const user = await Model.findById(data.userId, {
      password: 0,
      __v: 0,
    }).lean()

    if (!user) throw new CustomError(errors.userNotFound, 404)

    return user
  }

  async updateProfile(data) {
    const user = await Model.findByIdAndUpdate(
      data.userId,
      { $set: data },
      { new: true }
    )
      .select("-password")
      .lean()

    if (!user) throw new CustomError(errors.userNotFound, 404)

    return user
  }

  async updatePassword(data) {
    if (data.old_password === data.password)
      throw new CustomError(errors.samePassword, 400)

    let user = await Model.findById(data.userId)
    if (!user) throw new CustomError(errors.userNotFound, 404)

    let check = compareHash(data.old_password, user.password)
    if (!check) throw new CustomError(errors.passwordInvalid, 406)

    data.password = hash(data.password)

    user = await user.updateOne({
      $set: data,
    })

    if (!user) throw new CustomError(errors.userNotFound, 404)

    return
  }

  async deactivateProfile(data) {
    const user = await Model.findByIdAndUpdate(data.userId, {
      $set: { status: "inactive" },
    }).lean()

    if (!user) throw new CustomError(errors.userNotFound, 404)

    return
  }
}

module.exports = new Service()
