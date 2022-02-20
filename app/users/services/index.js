const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")

class Service {
  async getAll() {
    const users = await Model.find({ role: "user" }).select("-password").lean()

    return users
  }

  async getOne(data, throwError = true) {
    const user = await Model.findById(data.userId).lean()

    if (throwError && !user) {
      throw new CustomError(errors.userNotFound, 400, {
        email: errors.userNotFound,
      })
    }

    return user
  }

  async createOne(data) {
    const user = await Model.create(data)

    if (!user) throw new CustomError(errors.error, 400)
    return user
  }

  async updateOne(data) {
    const user = await Model.findByIdAndUpdate(data.userId, data, {
      new: true,
    })
      .select("-password")
      .lean()

    if (!user) throw new CustomError(errors.error, 400)
    return user
  }

  async deleteOne(data) {
    const user = await Model.findByIdAndUpdate(
      data.userId,
      {
        $set: {
          status: "inactive",
        },
      },
      { new: true }
    )
      .select("-password")
      .lean()

    if (!user) throw new CustomError(errors.error, 400)
    return user
  }

  async getOneByEmail(email, throwError = true) {
    let user = await Model.findOne({ email }).lean()

    if (throwError && !user) {
      throw new CustomError(errors.userNotFound, 400, {
        email: errors.userNotFound,
      })
    }

    return user
  }

  async updateOneByEmail(data) {
    const user = await Model.findOneAndUpdate({ email: data.email }, data, {
      new: true,
    })
      .select("-password")
      .lean()

    if (!user) throw new CustomError(errors.error, 400)
    return user
  }

  async checkIsEmailUnique(data) {
    const user = await Model.findOne({ email: data.email })
      .select("email")
      .lean()

    if (user) {
      throw new CustomError(errors.emailExists, 400, {
        email: errors.emailExists,
      })
    }

    return
  }
}

module.exports = new Service()
