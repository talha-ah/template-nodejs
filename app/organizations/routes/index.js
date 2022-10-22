const router = require("express").Router()

const controller = require("../controllers")
const auth = require("../../../middlewares/auth")

router.get("/metadata", auth(), controller.getMetadata)

router.get("/users", auth(), controller.getUsers)
router.delete("/users/:id", auth(), controller.removeUser)

router.get("/", auth(), controller.getAll)
router.get("/:organizationId", auth(), controller.getOne)
router.delete("/:organizationId", auth(), controller.deactivateOne)

module.exports = router
