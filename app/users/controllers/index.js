const { texts } = require("../../../utils/texts")
const { CustomResponse } = require("../../../utils/CustomResponse")

const Service = require("../services")
const Validations = require("../validations")

class Contoller {
  async getAll(req, res) {
    // Superadmin
    // const data = await Validations.getAll({
    //   userId: req.userId,
    //   organizationId: req.organizationId,
    // })

    const response = await Service.getAll(data)

    res.status(200).json(CustomResponse(texts.users, response))
  }

  async deleteOne(req, res) {
    // Superadmin
    // const data = await Validations.getOne({
    //   userId: req.userId,
    //   organizationId: req.organizationId,
    //   ...req.params,
    // })

    const response = await Service.deleteOne(data)

    res.status(200).json(CustomResponse(texts.userDeleted, response))
  }
}

module.exports = new Contoller()
