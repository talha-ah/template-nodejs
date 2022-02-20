const { texts } = require("../../../utils/texts")
const { CustomResponse } = require("../../../utils/CustomResponse")

const Service = require("../services")
const Validations = require("../validations")

class Contoller {
  async getAll(req, res) {
    const data = await Validations.getAll({
      userId: req.userId,
      organizationId: req.organizationId,
    })

    const response = await Service.getAll(data)

    res.status(200).json(CustomResponse(texts.invites, response))
  }

  async createOne(req, res) {
    const data = await Validations.createOne({
      userId: req.userId,
      organizationId: req.organizationId,
      ...req.body,
    })

    const response = await Service.createOne(data)

    res.status(200).json(CustomResponse(texts.invites, response))
  }

  async deleteOne(req, res) {
    const data = await Validations.invite({
      userId: req.userId,
      organizationId: req.organizationId,
      ...req.params,
    })

    const response = await Service.deleteOne(data)

    res.status(200).json(CustomResponse(texts.invites, response))
  }

  async checkInvite(req, res) {
    const data = await Validations.checkInvite(req.params)

    const response = await Service.checkInvite(data)

    res.status(200).json(CustomResponse(texts.invites, response))
  }

  async acceptInvite(req, res) {
    const data = await Validations.acceptInvite({ ...req.body, ...req.params })

    const response = await Service.acceptInvite(data)

    res.status(200).json(CustomResponse(texts.invites, response))
  }

  async rejectInvite(req, res) {
    const data = await Validations.checkInvite(req.params)

    const response = await Service.rejectInvite(data)

    res.status(200).json(CustomResponse(texts.invites, response))
  }

  async resendInvite(req, res) {
    const data = await Validations.invite({
      userId: req.userId,
      organizationId: req.organizationId,
      ...req.params,
    })

    const response = await Service.resendInvite(data)

    res.status(200).json(CustomResponse(texts.invites, response))
  }
}

module.exports = new Contoller()
