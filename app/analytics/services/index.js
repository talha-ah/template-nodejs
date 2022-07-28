const ObjectId = require("mongodb").ObjectID

const UserModel = require("../../users/models")

module.exports.getUsers = async (data) => {
  let endDate = new Date()
  let startDate = new Date()

  if (data.interval === "week") {
    startDate.setDate(startDate.getDate() - 7)
  }
  if (data.interval === "month") {
    startDate.setMonth(startDate.getMonth() - 1)
  }
  if (data.interval === "year") {
    startDate.setFullYear(startDate.getFullYear() - 1)
  }

  let previousEndDate = new Date(startDate)
  let previousStartDate = new Date(startDate)

  if (data.interval === "week") {
    previousStartDate.setDate(previousStartDate.getDate() - 7)
  }
  if (data.interval === "month") {
    previousStartDate.setMonth(previousStartDate.getMonth() - 1)
  }
  if (data.interval === "year") {
    previousStartDate.setFullYear(previousStartDate.getFullYear() - 1)
  }

  const currentData = await UserModel.find({
    organizationId: ObjectId(data.organizationId),
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  }).countDocuments()

  const previousData = await UserModel.find({
    organizationId: ObjectId(data.organizationId),
    createdAt: {
      $gte: previousStartDate,
      $lt: previousEndDate,
    },
  }).countDocuments()

  return { currentData, previousData }
}

module.exports.getUsersChart = async (data) => {
  let endDate = new Date()
  let startDate = new Date()
  let group = {}

  if (data.interval === "week") {
    group = { $dayOfWeek: "$createdAt" }
    startDate.setDate(startDate.getDate() - 7)
  }
  if (data.interval === "month") {
    group = { $dateToString: { format: "%m", date: "$createdAt" } }
    startDate.setMonth(startDate.getMonth() - 1)
  }
  if (data.interval === "year") {
    group = { $dateToString: { format: "%Y", date: "$createdAt" } }
    startDate.setFullYear(startDate.getFullYear() - 1)
  }

  const response = await UserModel.aggregate([
    {
      $match: {
        organizationId: ObjectId(data.organizationId),
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: group,
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        _id: 0,
        key: "$_id",
        value: "$count",
      },
    },
  ])

  return response
}
