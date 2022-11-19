const { texts } = require("../../../utils/texts")
const { customResponse } = require("../../../utils/response")

const Service = require("../services")
const Validations = require("../validations")

module.exports.fetchProfile = async (req, res) => {
  const data = await Validations.checkUserId({
    userId: req.userId,
  })

  const response = await Service.fetchProfile(data)

  res.status(200).json(customResponse(texts.fetchProfile, response))
}

module.exports.updateProfile = async (req, res) => {
  const data = await Validations.updateProfile({
    userId: req.userId,
    ...req.body,
  })

  const response = await Service.updateProfile(data)

  res.status(200).json(customResponse(texts.profileUpdated, response))
}

module.exports.updatePassword = async (req, res) => {
  const data = await Validations.updatePassword({
    userId: req.userId,
    ...req.body,
  })

  const response = await Service.updatePassword(data)

  res.status(200).json(customResponse(texts.passwordUpdated, response))
}

module.exports.deactivateProfile = async (req, res) => {
  const data = await Validations.checkUserId({
    userId: req.userId,
  })

  const response = await Service.deactivateProfile(data)

  res.status(200).json(customResponse(texts.userDeactivated, response))
}

module.exports.updateFcmToken = async (req, res) => {
  const data = await Validations.updateFcmToken({
    userId: req.userId,
    ...req.body,
  })

  const response = await Service.updateFcmToken(data)

  res.status(200).json(customResponse(texts.updateFcmToken, response))
}

module.exports.updateTheme = async (req, res) => {
  const data = await Validations.updateTheme({
    userId: req.userId,
    ...req.body,
  })

  const response = await Service.updateTheme(data)

  res.status(200).json(customResponse(texts.updateTheme, response))
}
