const router = require("express").Router()

const controller = require("../controllers")
const auth = require("../../../middlewares/auth")

router.use("/users", require("../../organization-user"))

router.get("/metadata", auth(), controller.getMetadata)

router.get("/", auth(), controller.getAll)
router.put("/", auth(), controller.updateOne)
router.post("/", auth(), controller.createOne)
router.get("/:organizationId", auth(), controller.getOne)
router.delete("/:organizationId", auth(), controller.deactivateOne)

module.exports = router
