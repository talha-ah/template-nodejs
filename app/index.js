const router = require("express").Router()

const auth = require("./auth")
const users = require("./users")
const profile = require("./profile")

router.use("/auth", auth)
router.use("/users", users)
router.use("/profile", profile)

module.exports = router
