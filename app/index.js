const router = require("express").Router()

const auth = require("./auth")
const users = require("./users")
const profile = require("./profile")
const invites = require("./invites")
const organizations = require("./organizations")

router.use("/auth", auth)
router.use("/users", users)
router.use("/profile", profile)
router.use("/invites", invites)
router.use("/organizations", organizations)

module.exports = router
