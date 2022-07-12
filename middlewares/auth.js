const { errors } = require("../utils/texts")
const { useJWT } = require("../utils/helpers")
const { permissions } = require("../utils/metadata")
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

    const user = decoded.user

    if (!user) throw new CustomError(errors.accountNotFound, 401)
    if (user.status === "inactive") {
      throw new CustomError(errors.accountInactive, 401)
    }

    req.user = user
    req.userId = String(user._id)
    req.organizationId = String(user.organization._id)

    const userRole = user.role
    const orgRole = user.organization.role

    if (userRole === "superadmin") {
      next()
    } else {
      // handle route access based on role provided (if any) in the route
      if (role === "admin" && orgRole !== "admin") {
        throw new CustomError(errors.notAuthorized, 401)
      }

      const baseUrl = req.baseUrl.replace("/api/v1/", "")

      if (orgRole === "user" && req.method !== "GET") {
        if (permissions.user.indexOf(baseUrl) === -1) {
          throw new CustomError(errors.notAuthorized, 401)
        }
      }

      next()
    }
  }
}

module.exports = auth
