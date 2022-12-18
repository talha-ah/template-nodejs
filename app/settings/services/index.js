const ObjectId = require("mongodb").ObjectId

const { errors } = require("../../../utils/texts")
const { CustomError } = require("../../../utils/customError")

const InventoryModel = require("../models/inventory")

const OrganizationService = require("../../organizations/services")

const getSettingsInventory = async (data) => {
  let settings = await InventoryModel.findOne({
    organizationId: ObjectId(data.organizationId),
  }).lean()

  if (!settings) {
    const organization = await OrganizationService.getOne({
      organizationId: data.organizationId,
    })
    settings = await InventoryModel.create({
      organizationId: ObjectId(data.organizationId),
      ...organization,
    })

    settings = settings.toObject()
  }

  return settings
}

const updateSettingsInventory = async (data) => {
  const settings = await InventoryModel.findOneAndUpdate(
    {
      organizationId: ObjectId(data.organizationId),
    },
    {
      $set: data.settings,
    },
    {
      new: true,
      upsert: true,
    }
  ).lean()

  if (!settings) throw new CustomError(errors.error, 404)

  return settings
}

module.exports.getSettings = async (data) => {
  let response

  if (data.type === "inventory") {
    response = await getSettingsInventory(data)
  } else {
    throw new CustomError(errors.settingsTypeInvalid, 400)
  }

  return response
}

module.exports.updateSettings = async (data) => {
  if (data.type === "inventory") {
    await updateSettingsInventory(data)
  } else {
    throw new CustomError(errors.settingsTypeInvalid, 400)
  }

  const response = await this.getSettings(data)

  return response
}
