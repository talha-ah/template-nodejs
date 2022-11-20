const router = require("express").Router()

const controller = require("../controllers")
const auth = require("../../../middlewares/auth")

router.get("/metadata", auth(), controller.getMetadata)

router.get("/users", auth(), controller.getUsers)
router.put("/users", auth(), controller.updateUsers)
router.put("/users/:id", auth(), controller.updateUser)
router.delete("/users/:id", auth(), controller.removeUser)

router.get("/", auth(), controller.getAll)
router.put("/", auth(), controller.updateOne)
router.post("/", auth(), controller.createOne)
router.get("/:organizationId", auth(), controller.getOne)
router.delete("/:organizationId", auth(), controller.deactivateOne)

module.exports = router
