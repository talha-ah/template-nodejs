const { texts } = require("../../../utils/texts")
const { CustomResponse } = require("../../../utils/CustomResponse")

const Service = require("../services")
const Validations = require("../validations")

class Contoller {
  async getAll(req, res) {
    const data = await Validations.getAll({
      userId: req.userId,
      ...req.query,
    })

    const response = await Service.getAll(data)

    res.status(200).json(CustomResponse(texts.organizations, response))
  }

  async getOne(req, res) {
    const data = await Validations.checkOne({
      userId: req.userId,
      ...req.params,
    })

    const response = await Service.getOne(data)

    res.status(200).json(CustomResponse(texts.organizations, response))
  }

  async deleteOne(req, res) {
    const data = await Validations.checkOne({
      userId: req.userId,
      ...req.params,
    })

    const response = await Service.deleteOne(data)

    res.status(200).json(CustomResponse(texts.organizations, response))
  }

  async getUsers(req, res) {
    const data = await Validations.getUsers({
      userId: req.userId,
      organizationId: req.organizationId,
    })

    const response = await Service.getUsers(data)

    res.status(200).json(CustomResponse(texts.users, response))
  }

  async removeUser(req, res) {
    const data = await Validations.removeUser({
      userId: req.userId,
      organizationId: req.organizationId,
      ...req.params,
    })

    const response = await Service.removeUser(data)

    res.status(200).json(CustomResponse(texts.userDeleted, response))
  }
}

module.exports = new Contoller()
