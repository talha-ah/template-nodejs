const router = require("express").Router()

router.use("/auth", require("./auth"))
router.use("/users", require("./user"))

module.exports = router
