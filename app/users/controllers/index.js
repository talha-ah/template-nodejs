const { texts } = require("../../../utils/texts")
const { CustomResponse } = require("../../../utils/response")

const Service = require("../services")
const Validations = require("../validations")

class Contoller {
  async getAll(req, res) {
    const response = await Service.getAll()

    res.status(200).json(CustomResponse(texts.users, response))
  }

  async getOne(req, res) {
    const data = await Validations.checkUserId(req.params)

    const response = await Service.getOne(data)

    res.status(200).json(CustomResponse(texts.user, response))
  }

  async deleteOne(req, res) {
    const data = await Validations.checkUserId(req.params)

    const response = await Service.deleteOne(data)

    res.status(201).json(CustomResponse(texts.userDeleted, response))
  }
}

module.exports = new Contoller()
