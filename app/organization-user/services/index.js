const { ObjectId } = require("mongodb")

const { errors } = require("../../../utils/texts")
const { PERMISSIONS } = require("../../../utils/metadata")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")
const UserModel = require("../../users/models")
const OrganizationModel = require("../../organizations/models")

const shouldUpdatePermissions = (permissions, userPermissions) => {
  let needUpdate = false

  Object.keys(permissions).forEach((key) => {
    if (!userPermissions[key]) needUpdate = true
  })

  return needUpdate
}

module.exports.formatPermissions = (permissions) => {
  if (!permissions) return

  let formatted_permissions = {}

  // Making sure all the permissions modules & settings are returned
  // even if the user does not have them in it's permissions obj in the DB (when new permissions added)
  Object.entries(PERMISSIONS.permissions).forEach(([key, value]) => {
    if (!permissions[key]) {
      permissions[key] = {
        modules: value.modules,
        settings: value.settings,
        permission: value.permission,
        description: value.description,
      }
    } else {
      permissions[key] = {
        modules: permissions[key].modules || {},
        settings: permissions[key].settings || {},
        description: permissions[key].description || "",
        permission: permissions[key].permission || "upgrade",
      }
    }

    formatted_permissions[key] = {
      description: value.description,
      permission: permissions[key].permission,
      modules: Object.keys(value.modules).reduce((a, k) => {
        a[k] = permissions[key].modules[k] || permissions[key].permission
        return a
      }, {}),
      settings: Object.keys(value.settings).reduce((a, k) => {
        a[k] = permissions[key].settings[k] || permissions[key].permission
        return a
      }, {}),
    }
  })

  return formatted_permissions
}

module.exports.rolePermissions = (role) => {
  const permissions = Object.entries(PERMISSIONS["permissions"]).reduce(
    (result, [key, value]) => {
      result[key] = {
        permission: role,
        description: value.description,
        modules: {},
        settings: {},
      }

      result[key]["modules"] = Object.keys(value.modules).reduce((a, k) => {
        a[k] = role
        return a
      }, {})

      result[key]["settings"] = Object.keys(value.settings).reduce((a, k) => {
        a[k] = role
        return a
      }, {})

      return result
    },
    {}
  )

  return permissions
}

module.exports.getAll = async (data) => {
  return await this.getOrganizationUsers(data)
}

module.exports.getOrganizationUsers = async (data) => {
  const response = await Model.aggregate([
    {
      $match: {
        organizationId: ObjectId(data.organizationId),
      },
    },
    {
      $lookup: {
        from: UserModel.collection.name,
        localField: "userId",
        foreignField: "_id",
        as: "userId",
        pipeline: [
          {
            $project: {
              image: 1,
              email: 1,
              phone: 1,
              lastName: 1,
              firstName: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$userId",
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$$ROOT", "$userId"],
        },
      },
    },
    {
      $project: {
        userId: 0,
        organizationId: 0,
      },
    },
  ])

  return response
}

module.exports.getUserOrganizations = async (data) => {
  const response = await Model.aggregate([
    {
      $match: {
        userId: ObjectId(data.userId),
      },
    },
    {
      $lookup: {
        from: OrganizationModel.collection.name,
        localField: "organizationId",
        foreignField: "_id",
        as: "organizationId",
        pipeline: [
          {
            $project: {
              logo: 1,
              name: 1,
              email: 1,
              phone: 1,
              address: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$organizationId",
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$$ROOT", "$organizationId"],
        },
      },
    },
    {
      $project: {
        userId: 0,
        organizationId: 0,
      },
    },
  ])

  return response
}

module.exports.addUser = async (data) => {
  const permissions = this.rolePermissions(data.role)

  const response = await Model.create({
    ...data,
    permissions,
  })

  return response.toObject()
}

module.exports.updateOne = async (data) => {
  const permissions = this.rolePermissions(data.role)

  await Model.findOneAndUpdate(
    {
      userId: ObjectId(data.userId),
      organizationId: ObjectId(data.organizationId),
    },
    {
      $set: {
        role: data.role,
        permissions: permissions,
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

module.exports.updateMany = async (data) => {
  await Model.bulkWrite(
    data.users.map((user) => {
      const permissions = this.rolePermissions(user.role)

      return {
        updateOne: {
          filter: {
            userId: ObjectId(user.id),
            organizationId: ObjectId(data.organizationId),
          },
          update: {
            $set: {
              role: user.role,
              permissions: permissions,
            },
          },
          new: true,
        },
      }
    })
  )

  return
}

module.exports.removeOne = async (data) => {
  await Model.findOneAndDelete({
    userId: data.userId,
    organizationId: data.organizationId,
  })
    .select("_id")
    .lean()

  return
}

module.exports.getUserRole = async (data) => {
  const response = await Model.findOne({
    userId: data.userId,
    organizationId: data.organizationId,
  })
    .select("role")
    .lean()

  if (!response) throw new CustomError(errors.userNotFound, 400)

  return response.role
}

module.exports.getUserPermissions = async (data) => {
  const response = await Model.findOne({
    userId: data.userId,
    organizationId: data.organizationId,
  })
    .select("role permissions")
    .lean()

  if (!response) throw new CustomError(errors.userNotFound, 400)

  const permissions = this.rolePermissions(response.role)

  // // Check if permissions have changed
  // const shouldUpdate = shouldUpdatePermissions(
  //   permissions,
  //   response.permissions
  // )

  if (
    !response.permissions
    // || shouldUpdate
  ) {
    response.permissions = permissions

    // Update user permissions
    await this.updateUserPermissions({
      userId: data.userId,
      permissions: response.permissions,
      organizationId: data.organizationId,
    })
  }

  return response.permissions
}

module.exports.updateUserPermissions = async (data) => {
  const response = await Model.findOneAndUpdate(
    {
      userId: data.userId,
      organizationId: data.organizationId,
    },
    {
      $set: {
        permissions: data.permissions,
      },
    }
  ).lean()

  if (!response) throw new CustomError(errors.userNotFound, 400)

  return
}

module.exports.checkUserExists = async (data) => {
  const response = await Model.findOne({
    userId: data.userId,
    organizationId: data.organizationId,
  })
    .select("_id")
    .lean()

  return !!response
}

module.exports.deactivateUserOrganizations = async (data) => {
  // Get all user organizations
  const documents = await Model.find({
    userId: data.userId,
    // role: "admin",
    owner: true,
  }).lean()

  // Delete all user organizations
  await Model.deleteMany({
    userId: data.userId,
  })

  // Deactivate all user organizations
  await OrganizationModel.updateMany(
    {
      _id: documents.map((doc) => doc.organizationId),
    },
    {
      $set: {
        status: "inactive",
      },
    }
  ).lean()

  return
}
