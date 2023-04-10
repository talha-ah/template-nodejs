const { errors } = require("../utils/texts")
const { useJWT } = require("../utils/helpers")
const { PERMISSIONS } = require("../utils/metadata")
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

    if (user.role === "superadmin") {
      next()
    } else {
      const orgRole = user.organization.role
      const method = req.method.toUpperCase()
      let baseUrl = req.baseUrl.replace("/api/v1/", "") + req.path

      if (baseUrl.endsWith("/")) {
        baseUrl = baseUrl.slice(0, -1)
      }

      const generalAllowed = PERMISSIONS.general.routes.some((route) =>
        route.regex.test(baseUrl)
      )
      // const privateAllowed = PERMISSIONS[orgRole].routes.some(
      //   (route) =>
      //     (route.methods[0] === "ALL" || route.methods.includes(method)) &&
      //     route.regex.test(baseUrl)
      // )
      const privateAllowed = true

      if (!generalAllowed && !privateAllowed) {
        throw new CustomError(errors.notAuthorized, 401)
      }

      next()
    }
  }
}

module.exports = auth
