const router = require("express").Router()

const controller = require("../controllers")
const auth = require("../../../middlewares/auth")

router.get("/metadata", auth(), controller.getMetadata)

router.get("/users", auth("admin"), controller.getUsers)
router.delete("/users/:id", auth("admin"), controller.removeUser)

router.get("/", auth(), controller.getAll)
router.get("/:organizationId", auth(), controller.getOne)
router.delete("/:organizationId", auth("admin"), controller.deleteOne)

module.exports = router
