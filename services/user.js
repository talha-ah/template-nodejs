const Texts = require("../utils/texts")
const UserModel = require("../models/user")
const CustomError = require("../utils/customError")

class UserService {
  async fetchProfile(data) {
    const user = await UserModel.findOne(
      { _id: data.userId },
      { password: 0, __v: 0 }
    ).lean()

    if (!user) throw new CustomError(Texts.errors.userNotFound)

    return user
  }

  async updateProfile(data) {
    const user = await UserModel.findByIdAndUpdate(data.userId, { $set: data })

    if (!user) throw new CustomError(Texts.errors.userNotFound, 404)

    return user
  }

  async deactivateProfile(data) {
    const user = await UserModel.findByIdAndUpdate(data.userId, {
      $set: { status: "inactive" },
    })

    if (!user) throw new CustomError(Texts.errors.userNotFound, 404)

    return
  }
}

module.exports = new UserService()
