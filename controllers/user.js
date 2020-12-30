const User = require("../models/user");
const Texts = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");

class UserContoller {
  async create(req, res) {
    const result = await new User(req.body).save();
    res.status(200).send(response(Texts.texts.userCreated, result));
  }

  async getAll(req, res) {
    const result = await User.find({}, { password: 0, __v: 0 });
    res.status(200).send(response(Texts.texts.allUsers, result));
  }

  async getOne(req, res) {
    const userId = req.params.userId;

    const result = await User.findOne({ _id: userId }, { password: 0, __v: 0 });
    if (!result) throw new CustomError(Texts.errors.userNotFound);

    res.status(200).send(response(Texts.texts.userData, result));
  }

  async update(req, res) {
    const userId = req.params.userId;
    const data = req.body;

    const result = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: data },
      { new: true }
    );

    if (!result) throw new CustomError(Texts.errors.userNotFound, 404);

    res.status(200).send(response(Texts.texts.userUpdated, result));
  }

  async delete(req, res) {
    const userId = req.params.userId;

    const result = await User.findOne({ _id: userId });
    result.remove();

    res.status(200).send(response(Texts.texts.userDeleted, result));
  }
}

module.exports = new UserContoller();
