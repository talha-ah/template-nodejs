const router = require("express").Router()

const controller = require("../controllers")
const auth = require("../../../middlewares/auth")

router.get("/check/:token", controller.checkInvite)
router.post("/accept/:token", controller.acceptInvite)
router.delete("/reject/:token", controller.rejectInvite)

router.get("/", auth(), controller.getAll)
router.post("/", auth(), controller.createOne)
router.delete("/:token", auth(), controller.deleteOne)
router.post("/resend/:token", auth(), controller.resendInvite)

module.exports = router
