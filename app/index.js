const auth = require("./auth")
const users = require("./users")
const profile = require("./profile")

module.exports = function (app) {
  app.use("/api/v1/auth", auth)
  app.use("/api/v1/users", users)
  app.use("/api/v1/profile", profile)
}
