const ENV = process.env

const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")

module.exports.getAll = async (data) => {
  const page = +data.page || 1
  const limit = +data.limit || +ENV.LIMIT

  const response = await Model.find({ role: "user" })
    .select("-password")
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()

  return response
}

module.exports.getOne = async (data, throwError = true) => {
  const response = await Model.findById(data.userId).lean()

  if (throwError && !response) {
    throw new CustomError(errors.userNotFound, 400)
  }

  return response
}

module.exports.createOne = async (data) => {
  const user = await Model.create(data)

  if (!user) throw new CustomError(errors.error, 400)
  return user.toObject()
}

module.exports.updateOne = async (data) => {
  const response = await Model.findByIdAndUpdate(data.userId, data, {
    new: true,
  })
    .select("-password")
    .lean()

  if (!response) throw new CustomError(errors.error, 400)
  return response
}

module.exports.deleteOne = async (data) => {
  const response = await Model.findByIdAndUpdate(
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

  if (!response) throw new CustomError(errors.error, 400)
  return response
}

module.exports.getOneByEmail = async (email, throwError = true) => {
  let response = await Model.findOne({ email }).lean()

  if (throwError && !response) {
    throw new CustomError(errors.userNotFound, 400)
  }

  return response
}

module.exports.updateOneByEmail = async (data) => {
  const response = await Model.findOneAndUpdate({ email: data.email }, data, {
    new: true,
  })
    .select("-password")
    .lean()

  if (!response) throw new CustomError(errors.error, 400)
  return response
}

module.exports.checkIsEmailUnique = async (email) => {
  const response = await Model.findOne({ email }).select("email").lean()

  if (response) throw new CustomError(errors.accountFound, 400)
  return
}

module.exports.updateLastLogin = async (data) => {
  const response = await Model.findByIdAndUpdate(
    data.userId,
    {
      $set: {
        lastLogin: {
          ip: data.ip,
          organizationId: data.organizationId,
          timestamp: data.timestamp || new Date(),
        },
      },
    },
    {
      new: true,
    }
  )
    .select("-password")
    .lean()

  if (!response) throw new CustomError(errors.error, 400)
  return response
}
