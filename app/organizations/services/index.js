const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")

class Service {
  async getAll(data) {
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

  async getOne(data) {
    const org = await Model.findById(data.organizationId)
      .select("-users")
      .lean()

    return org
  }

  async createOne(data) {
    const org = await Model.create(data)

    if (!org) throw new CustomError(errors.error, 400)
    return org
  }

  async deleteOne(data) {
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

  async isAdmin(data) {
    const org = await Model.findOne({
      _id: data.organizationId,
      "users.userId": data.userId,
    }).lean()

    if (!org) throw new CustomError(errors.organizationNotFound, 400)

    let role = org.users.find(
      (user) => String(user.userId) === String(data.userId)
    ).role

    if (role !== "admin") throw new CustomError(errors.notAdmin, 400)

    return
  }

  async getUsers(data) {
    await this.isAdmin(data)

    const org = await Model.findOne({
      _id: data.organizationId,
      "users.userId": data.userId,
    })
      .populate("users.userId")
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

  async addUser(data) {
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

  async removeUser(data) {
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

  async getUserRole(data) {
    const org = await Model.findOne({
      _id: data.organizationId,
      "users.userId": data.userId,
    }).lean()

    role = org.users.find(
      (user) => String(user.userId) === String(data.userId)
    ).role

    return role
  }

  async checkUserExists(data) {
    const user = await Model.findOne({
      _id: data.organizationId,
      "users.userId": data.userId,
    }).lean()

    return !!user
  }

  async deactivateUserOrganizations(data) {
    await Model.updateMany(
      {
        users: { $elemMatch: { userId: data.userId, role: "admin" } },
      },
      {
        $set: {
          status: "inactive",
        },
      }
    ).lean()

    return
  }
}

module.exports = new Service()
