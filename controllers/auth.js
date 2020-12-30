const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const JWT = require("jsonwebtoken");

const User = require("../models/user");
const Texts = require("../utils/texts");
const response = require("../utils/response");
const CustomError = require("../utils/customError");
const ENV = process.env;

class AuthContoller {
  async signup(req, res) {
    const data = req.body;

    let user = await User.findOne({ email: data.email });
    if (user) throw new CustomError(Texts.errors.emailExists);

    user = new User(data);
    const token = JWT.sign({ id: user._id, role: "user" }, ENV.JWT_SECRET);
    await user.save();

    const result = {
      uid: user._id,
      role: user.role,
      email: user.email,
      token: token,
    };

    res.status(201).send(response(Texts.texts.userCreated, result));
  }

  async signin(req, res) {
    const data = req.body;

    if (!data.email) throw new CustomError(Texts.errors.emailRequired);
    if (!data.password) throw new CustomError(Texts.errors.passwordRequired);

    // Check if user exist
    const user = await User.findOne({ email: data.email });
    if (!user) throw new CustomError(Texts.errors.emailInvalid);

    // Check if user password is correct
    const isCorrect = await bcrypt.compare(data.password, user.password);
    if (!isCorrect) throw new CustomError(Texts.errors.passwordInvalid);

    const token = await JWT.sign(
      { id: user._id, role: user.role },
      ENV.JWT_SECRET
    );

    result = {
      uid: user._id,
      email: user.email,
      role: user.role,
      verified: user.isVerified,
      token: token,
    };

    res.status(200).send(response(Texts.texts.loginSuccess, result));
  }

  async updatePassword(req, res) {
    const userId = req.params.userId;
    const data = req.body;

    const user = await User.findOne({ _id: userId });
    if (!user) throw new CustomError(Texts.errors.userNotFound);

    // Check if user password is correct
    const isCorrect = await bcrypt.compare(data.password, user.password);
    if (!isCorrect) throw new CustomError(Texts.errors.passwordInvalid);

    const hash = await bcrypt.hash(data.password, ENV.BCRYPT_SALT);

    const result = await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );

    res.status(200).send(response(Texts.texts.passwordSuccess, result));
  }

  async RequestEmailVerification(req, res) {
    const email = req.query.email;

    const user = await User.findOne({ email });
    if (!user) throw new CustomError(Texts.errors.emailInvalid);
    if (user.isVerified) throw new CustomError(Texts.errors.alreadyVerified);

    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    let verifyToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(verifyToken, BCRYPT_SALT);

    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    //send Mail
    const result = `${url.CLIENT_URL}/email-verification?uid=${user._id}&verifyToken=${verifyToken}`;

    res.status(200).send(response(Texts.texts.emailVerificationSent, result));
  }

  async VerifyEmail(req, res) {
    const { userId, verifyToken } = req.body;

    const user = await User.findOne({ _id: userId });
    if (!user) throw new CustomError(Texts.errors.userNotFound);
    if (user.isVerified) throw new CustomError(Texts.errors.alreadyVerified);

    let VToken = await Token.findOne({ userId });
    if (!VToken) throw new CustomError(Texts.errors.invalidToken);

    const isValid = await bcrypt.compare(verifyToken, VToken.token);
    if (!isValid) throw new CustomError(Texts.errors.invalidToken);

    await User.updateOne(
      { _id: userId },
      { $set: { isVerified: true } },
      { new: true }
    );

    const result = await VToken.deleteOne();

    res.status(200).send(response(Texts.texts.emailVerified, result));
  }

  async RequestPasswordReset(req, res) {
    const email = req.query.email;

    const user = await User.findOne({ email });
    if (!user) throw new CustomError(Texts.errors.emailInvalid);

    let token = await Token.findOne({ userId: user._id });
    if (token) await token.deleteOne();

    let resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, ENV.BCRYPT_SALT);

    await new Token({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    //send mail
    const result = `${url.CLIENT_URL}/reset-password?uid=${user._id}&resetToken=${resetToken}`;

    res.status(200).send(response(Texts.texts.passwordResetSent, result));
  }

  async resetPassword(req, res) {
    const { userId, resetToken, password } = req.body;

    let RToken = await Token.findOne({ userId });
    if (!RToken) throw new CustomError(Texts.errors.invalidToken);

    const isValid = await bcrypt.compare(resetToken, RToken.token);
    if (!isValid) throw new CustomError(Texts.errors.invalidToken);

    const hash = await bcrypt.hash(password, ENV.BCRYPT_SALT);

    const result = await User.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );

    await RToken.deleteOne();

    res.status(200).send(response(Texts.texts.passwordSuccess, result));
  }
}

module.exports = new AuthContoller();
