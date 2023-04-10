const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const Model = require("../models")
const MetadataModel = require("../models/metadata")

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

module.exports.getAll = async (data) => {
  let query = {
    status: { $ne: "inactive" },
  }

  if (data.status) query["status"] = data.status

  const response = await Model.find(query).lean()

  return response
}

module.exports.getOne = async (data) => {
  const response = await Model.findById(data.organizationId).lean()

  if (!response) throw new CustomError(errors.organizationNotFound, 400)

  return response
}

module.exports.createOne = async (data) => {
  // TODO: Add current user as admin to the organization
  const response = await Model.create(data)

  if (!response) throw new CustomError(errors.error, 400)
  return response
}

module.exports.updateOne = async (data) => {
  const response = await Model.findByIdAndUpdate(
    data.organizationId,
    {
      $set: data,
    },
    {
      new: true,
    }
  ).lean()

  if (!response) throw new CustomError(errors.error, 400)
  return response
}

module.exports.deactivateOne = async (data) => {
  const response = await Model.findByIdAndUpdate(
    data.organizationId,
    {
      $set: {
        status: "inactive",
      },
    },
    { new: true }
  ).lean()

  if (!response) throw new CustomError(errors.error, 400)
  return response
}
