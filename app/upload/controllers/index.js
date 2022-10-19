const { texts } = require("../../../utils/texts")
const { customResponse } = require("../../../utils/customResponse")

class Contoller {
  async upload(req, res) {
    const response = {
      image: req.body.image,
    }

    res.status(200).json(customResponse(texts.success, response))
  }
}

module.exports = new Contoller()
