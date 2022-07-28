const router = require("express").Router()

const controller = require("../controllers")
const auth = require("../../../middlewares/auth")

router.get("/users", auth(), controller.getUsers)
router.get("/users/charts", auth(), controller.getUsersChart)

module.exports = router
