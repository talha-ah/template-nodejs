const { texts } = require("../../../utils/texts")
const { CustomResponse } = require("../../../utils/CustomResponse")

const Service = require("../services")
const Validations = require("../validations")

class Contoller {
  async fetchProfile(req, res) {
    const data = await Validations.checkUserId({
      userId: req.userId,
    })

    const response = await Service.fetchProfile(data)

    res.status(200).json(CustomResponse(texts.fetchProfile, response))
  }

  async updateProfile(req, res) {
    const data = await Validations.updateProfile({
      userId: req.userId,
      ...req.body,
    })

    const response = await Service.updateProfile(data)

    res.status(200).json(CustomResponse(texts.profileUpdated, response))
  }

  async updatePassword(req, res) {
    const data = await Validations.updatePassword({
      userId: req.userId,
      ...req.body,
    })

    const response = await Service.updatePassword(data)

    res.status(200).json(CustomResponse(texts.passwordUpdated, response))
  }

  async deactivateProfile(req, res) {
    const data = await Validations.checkUserId({
      userId: req.userId,
    })

    const response = await Service.deactivateProfile(data)

    res.status(200).json(CustomResponse(texts.userDeactivated, response))
  }

  async updateFcmToken(req, res) {
    const data = await Validations.updateFcmToken({
      userId: req.userId,
      ...req.body,
    })

    const response = await Service.updateFcmToken(data)

    res.status(200).json(CustomResponse(texts.updateFcmToken, response))
  }
}

module.exports = new Contoller()
