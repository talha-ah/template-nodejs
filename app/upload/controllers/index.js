const { texts } = require("../../../utils/texts")
const { CustomResponse } = require("../../../utils/customResponse")

class Contoller {
  async upload(req, res) {
    const response = {
      image: req.body.image,
    }

    res.status(200).json(CustomResponse(texts.success, response))
  }
}

module.exports = new Contoller()
