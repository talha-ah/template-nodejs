const Validations = require("../validations")
const UserService = require("../services/user")
const CustomerResponse = require("../utils/response")

class UserContoller {
  async fetchProfile(req, res) {
    const response = await UserService.fetchProfile({ userId: req.userId })

    res.status(200).json(CustomerResponse(Texts.texts.userData, response))
  }

  async updateProfile(req, res) {
    const data = await Validations.user.updateProfile({
      userId: req.userId,
      ...req.body,
    })

    const response = await UserService.updateProfile(data)

    res.status(201).json(CustomerResponse(Texts.texts.userUpdated, response))
  }

  async deactivateProfile(req, res) {
    const response = await UserService.deactivateProfile({ userId: req.userId })

    res.status(201).json(CustomerResponse(Texts.texts.userDeleted, response))
  }
}

module.exports = new UserContoller()
