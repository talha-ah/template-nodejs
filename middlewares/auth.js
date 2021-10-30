const { errors } = require("../utils/texts")
const { useJWT } = require("../utils/helpers")
const UserModel = require("../app/users/models")
const { CustomError } = require("../utils/customError")

/**
 * If no role is passed the default role is user
 *
 * @param  {String} role role allowed to access the route
 */

function auth(role = "user") {
  return async (req, res, next) => {
    const header = req.get("Authorization")

    if (!header || !header.startsWith("Bearer")) {
      throw new CustomError(errors.tokenNotFound, 401)
    }
    const token = header.split(" ")[1]
    if (!token) {
      throw new CustomError(errors.tokenNotFound, 401)
    }

    const decoded = useJWT(token)

    let user = await UserModel.findById(decoded.id).lean()
    if (!user) throw new CustomError(errors.userNotFound, 401)
    else if (user.status === "inactive")
      throw new CustomError(errors.inactiveAccount, 401)
    else if (user.status === "pending")
      throw new CustomError(errors.pendingEmailVerification, 401)
    if (role !== user.role) throw new CustomError(errors.notAuthorized, 401)

    req.user = user
    req.userId = String(user._id)

    next()
  }
}

module.exports = auth
