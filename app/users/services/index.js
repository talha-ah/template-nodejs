const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")

module.exports.getAll = async () => {
  const users = await Model.find({ role: "user" }).select("-password").lean()

  return users
}

module.exports.getOne = async (data, throwError = true) => {
  const user = await Model.findById(data.userId).lean()

  if (throwError && !user) {
    throw new CustomError(errors.userNotFound, 400)
  }

  return user
}

module.exports.createOne = async (data) => {
  const user = await Model.create(data)

  if (!user) throw new CustomError(errors.error, 400)
  return user
}

module.exports.updateOne = async (data) => {
  const user = await Model.findByIdAndUpdate(data.userId, data, {
    new: true,
  })
    .select("-password")
    .lean()

  if (!user) throw new CustomError(errors.error, 400)
  return user
}

module.exports.deleteOne = async (data) => {
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

module.exports.getOneByEmail = async (email, throwError = true) => {
  let user = await Model.findOne({ email }).lean()

  if (throwError && !user) {
    throw new CustomError(errors.userNotFound, 400)
  }

  return user
}

module.exports.updateOneByEmail = async (data) => {
  const user = await Model.findOneAndUpdate({ email: data.email }, data, {
    new: true,
  })
    .select("-password")
    .lean()

  if (!user) throw new CustomError(errors.error, 400)
  return user
}

module.exports.checkIsEmailUnique = async (data) => {
  const user = await Model.findOne({ email: data.email }).select("email").lean()

  if (user) {
    throw new CustomError(errors.emailExists, 400)
  }

  return
}
