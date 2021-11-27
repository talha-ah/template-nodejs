const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")

class Service {
  async getAll() {
    const users = await Model.find(
      { role: "user" },
      { password: 0, __v: 0 }
    ).lean()

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

    if (!user) throw new CustomError(errors.userNotFound, 404)
    return user
  }
}

module.exports = new Service()
