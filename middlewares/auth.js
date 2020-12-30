const JWT = require("jsonwebtoken");
const User = require("../models/user");
const CustomError = require("../utils/customError");

/**
 * If no role is passed the default role is user
 *
 * @param  {String} role role allowed to access the route
 */

function auth(role = "user") {
  // roles = roles.length > 0 && roles : role.USER;

  return async (req, res, next) => {
    const header = req.get("Authorization");

    if (!header || !header.startsWith("Bearer")) {
      throw new CustomError("Unauthorized access: Token not found", 401);
    }
    const token = header.split(" ")[1];
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    let user = await User.findOne({ _id: decoded.id });
    if (!user)
      throw new CustomError("Unauthorized access: User does not exist", 401);
    if (!user.isActive)
      throw new CustomError(
        "Unauthorized access: User has been deactivated",
        401
      );
    if (!user.isVerified)
      throw new CustomError(
        "Unauthorized access: Please verify email address",
        401
      );
    if (role !== user.role) throw new CustomError("Unauthorized access", 401);

    req.user = user;

    next();
  };
}

module.exports = auth;
