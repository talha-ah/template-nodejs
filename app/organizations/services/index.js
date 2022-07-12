const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")
const MetadataModel = require("../models/metadata")

module.exports.isAdmin = async (data) => {
  const org = await Model.findOne({
    _id: data.organizationId,
    "users.userId": data.userId,
  }).lean()

  if (!org) throw new CustomError(errors.organizationNotFound, 400)

  let role = org.users.find(
    (user) => String(user.userId) === String(data.userId)
  ).role

  if (role !== "admin") throw new CustomError(errors.notAuthorized, 400)

  return true
}

module.exports.getAll = async (data) => {
  let query = {
    status: { $ne: "inactive" },
  }

  if (data.status) query["status"] = data.status
  if (data.userId) query["users.userId"] = data.userId

  let orgs = await Model.find(query).lean()

  if (data.userId) {
    orgs = orgs.map((org) => {
      const user = org.users.find(
        (u) => String(u.userId) === String(data.userId)
      )
      if (user) org.role = user.role
      delete org.users
      return org
    })
  }

  return orgs
}

module.exports.getOne = async (data) => {
  const org = await Model.findById(data.organizationId).select("-users").lean()

  return org
}

module.exports.createOne = async (data) => {
  const org = await Model.create(data)

  if (!org) throw new CustomError(errors.error, 400)
  return org
}

module.exports.deleteOne = async (data) => {
  const org = await Model.findByIdAndUpdate(
    data.organizationId,
    {
      $set: {
        status: "inactive",
      },
    },
    { new: true }
  )
    .select("-users")
    .lean()

  if (!org) throw new CustomError(errors.error, 400)
  return org
}

module.exports.getUsers = async (data) => {
  await this.isAdmin(data)

  const org = await Model.findOne({
    _id: data.organizationId,
    "users.userId": data.userId,
  })
    .populate("users.userId")
    .select("users")
    .lean()

  if (!org) throw new CustomError(errors.organizationNotFound, 400)

  const users = org.users.map((user) => {
    delete user.userId.password
    return {
      ...user.userId,
      role: user.role,
    }
  })

  return users
}

module.exports.addUser = async (data) => {
  const org = await Model.findByIdAndUpdate(
    data.organizationId,
    {
      $addToSet: {
        users: {
          role: data.role,
          userId: data.userId,
        },
      },
    },
    {
      new: true,
    }
  )
    .select("-users")
    .lean()

  return org
}

module.exports.removeUser = async (data) => {
  await this.isAdmin(data)

  await Model.findByIdAndUpdate(
    data.organizationId,
    {
      $pull: {
        users: { userId: data.id },
      },
    },
    {
      new: true,
    }
  )
    .select("_id")
    .lean()

  return
}

module.exports.getUserRole = async (data) => {
  const org = await Model.findOne({
    _id: data.organizationId,
    "users.userId": data.userId,
  })
    .select("users")
    .lean()

  role = org.users.find(
    (user) => String(user.userId) === String(data.userId)
  ).role

  return role
}

module.exports.checkUserExists = async (data) => {
  const user = await Model.findOne({
    _id: data.organizationId,
    "users.userId": data.userId,
  })
    .select("_id")
    .lean()

  return !!user
}

module.exports.deactivateUserOrganizations = async (data) => {
  await Model.updateMany(
    {
      users: { $elemMatch: { userId: data.userId, role: "admin" } },
    },
    {
      $set: {
        status: "inactive",
      },
    }
  )
    .select("_id")
    .lean()

  return
}

module.exports.getMetadata = async (data) => {
  let metadata = await MetadataModel.findOne({
    organizationId: data.organizationId,
  }).lean()

  if (!metadata) {
    metadata = await MetadataModel.create({
      organizationId: data.organizationId,
    })
  }

  return response
}
