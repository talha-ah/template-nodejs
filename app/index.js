const router = require("express").Router()

const auth = require("./auth")
const users = require("./users")
const upload = require("./upload")
const profile = require("./profile")
const invites = require("./invites")
const analytics = require("./analytics")
const organizations = require("./organizations")

router.use("/auth", auth)
router.use("/users", users)
router.use("/upload", upload)
router.use("/profile", profile)
router.use("/invites", invites)
router.use("/analytics", analytics)
router.use("/organizations", organizations)

module.exports = router
