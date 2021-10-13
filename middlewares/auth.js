const JWT = require("jsonwebtoken")

const UserModel = require("@app/users/models")
const { CustomError } = require("@utils/customError")

/**
 * If no role is passed the default role is user
 *
 * @param  {String} role role allowed to access the route
 */

function auth(role = "user") {
  return async (req, res, next) => {
    const header = req.get("Authorization")

    if (!header || !header.startsWith("Bearer")) {
      throw new CustomError("Unauthorized access: Token not found", 401)
    }
    const token = header.split(" ")[1]
    if (!token) {
      throw new CustomError("Unauthorized access: Token not found", 401)
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET)

    let user = await UserModel.findById(decoded.id).lean()
    if (!user)
      throw new CustomError("Unauthorized access: User does not exist", 401)
    else if (user.status === "inactive")
      throw new CustomError("Account inactive: Kindly contact support", 401)
    else if (user.status === "pending")
      throw new CustomError("Please verify email address first", 401)
    if (role !== user.role) throw new CustomError("Unauthorized access", 401)

    req.user = user
    req.userId = String(user._id)

    next()
  }
}

module.exports = auth
