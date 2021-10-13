const { log } = require("@utils/helpers")
const { errors } = require("@utils/texts")
const { CustomError } = require("@utils/customError")

const Model = require("../models")

const ENV = process.env

class Service {
  async getAll(data) {
    log(ENV.ADMIN_SECRET)
    const users = await Model.find({}, { password: 0, __v: 0 }).lean()

    return users
  }

  async getOne(data) {
    const user = await Model.findById(data.userId, {
      password: 0,
      __v: 0,
    }).lean()

    return user
  }

  async deleteOne(data) {
    const user = await Model.findByIdAndDelete(data.userId)

    if (!user) throw new CustomError(errors.userNotFound, 404)

    return
  }
}

module.exports = new Service()
