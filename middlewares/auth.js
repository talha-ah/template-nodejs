const { errors } = require("../utils/texts")
const { useJWT } = require("../utils/helpers")
const { CustomError } = require("../utils/customError")

const UserService = require("../app/users/services")

/**
 * If no role is passed the default role is user
 *
 * @param  {String} role allowed to access the route
 */

function auth(role = "user") {
  return async (req, res, next) => {
    const header = req.get("Authorization")

    if (!header || !header.startsWith("Bearer")) {
      throw new CustomError(errors.tokenNotFound, 400)
    }
    const token = header.split(" ")[1]
    if (!token) {
      throw new CustomError(errors.tokenNotFound, 400)
    }

    const decoded = useJWT(token)

    if (!decoded.user) throw new CustomError(errors.tokenInvalid, 400)
    if (!decoded.user.organization)
      throw new CustomError(errors.tokenInvalid, 400)

    const user = await UserService.getOne({ userId: decoded.user._id })
    if (user.status === "inactive")
      throw new CustomError(errors.accountInactive, 400)
    if (role !== user.role) throw new CustomError(errors.notAuthorized, 400)

    req.user = decoded.user
    req.userId = String(decoded.user._id)
    req.organizationId = String(decoded.user.organization._id)

    next()
  }
}

module.exports = auth
