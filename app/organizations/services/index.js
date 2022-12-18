const ObjectId = require("mongodb").ObjectId

const { errors } = require("../../../utils/texts")
const { PERMISSIONS } = require("../../../utils/metadata")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")
const MetadataModel = require("../models/metadata")

const shouldUpdatePermissions = (permissions, userPermissions) => {
  let needUpdate = false

  Object.keys(permissions).forEach((key) => {
    if (!userPermissions[key]) needUpdate = true
  })

  return needUpdate
}

module.exports.formatPermissions = (role) => {
  const permissions = PERMISSIONS[role].modules

  return permissions
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

  if (!org) throw new CustomError(errors.organizationNotFound, 400)

  return org
}

module.exports.createOne = async (data) => {
  const org = await Model.create(data)

  if (!org) throw new CustomError(errors.error, 400)
  return org
}

module.exports.updateOne = async (data) => {
  const org = await Model.findByIdAndUpdate(
    data.organizationId,
    {
      $set: data,
    },
    {
      new: true,
    }
  )
    .select("-users")
    .lean()

  if (!org) throw new CustomError(errors.error, 400)
  return org
}

module.exports.deactivateOne = async (data) => {
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
  const org = await Model.findOne({
    _id: data.organizationId,
    "users.userId": data.userId,
  })
    .populate({
      path: "users.userId",
      select: "firstName lastName email phone lastLogin",
    })
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
  const permissions = this.formatPermissions(data.role)

  const org = await Model.findByIdAndUpdate(
    data.organizationId,
    {
      $addToSet: {
        users: {
          role: data.role,
          userId: data.userId,
          permissions,
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

module.exports.updateUser = async (data) => {
  const permissions = this.formatPermissions(data.role)

  await Model.findOneAndUpdate(
    {
      _id: ObjectId(data.organizationId),
      "users.userId": ObjectId(data.id),
    },
    {
      $set: {
        "users.$.role": data.role,
        "users.$.permissions": permissions,
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

module.exports.updateUsers = async (data) => {
  await Model.bulkWrite(
    data.users.map((user) => {
      const permissions = this.formatPermissions(user.role)

      return {
        updateOne: {
          filter: {
            _id: ObjectId(data.organizationId),
            "users.userId": ObjectId(user.id),
          },
          update: {
            $set: {
              "users.$.role": user.role,
              "users.$.permissions": permissions,
            },
          },
          new: true,
        },
      }
    })
  )

  return
}

module.exports.removeUser = async (data) => {
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

module.exports.getUserPermissions = async (data) => {
  const org = await Model.findOne({
    _id: data.organizationId,
    "users.userId": data.userId,
  }).lean()

  if (!org) throw new CustomError(errors.organizationNotFound, 400)

  let orgUser = org.users.find(
    (user) => String(user.userId) === String(data.userId)
  )

  if (!orgUser) throw new CustomError(errors.userNotFound, 400)

  const permissions = this.formatPermissions(orgUser.role)

  // Check if permissions have changed
  const shouldUpdate = shouldUpdatePermissions(permissions, orgUser.permissions)

  if (!orgUser.permissions || shouldUpdate) {
    orgUser.permissions = permissions

    // Update user permissions
    await this.updateUserPermissions({
      userId: data.userId,
      permissions: orgUser.permissions,
      organizationId: data.organizationId,
    })
  }

  return orgUser.permissions
}

module.exports.updateUserPermissions = async (data) => {
  const org = await Model.updateOne(
    {
      _id: data.organizationId,
      "users.userId": data.userId,
    },
    {
      $set: {
        "users.$.permissions": data.permissions,
      },
    }
  ).lean()

  if (!org) throw new CustomError(errors.organizationNotFound, 400)

  return
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
  let response = await MetadataModel.findOne({
    organizationId: data.organizationId,
  }).lean()

  if (!response) {
    response = await MetadataModel.create({
      organizationId: data.organizationId,
    })
  }

  return response
}
