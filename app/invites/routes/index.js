const router = require("express").Router()

const controller = require("../controllers")
const auth = require("../../../middlewares/auth")

router.get("/", auth(), controller.getAll)
router.post("/", auth(), controller.createOne)
router.delete("/:token", auth(), controller.deleteOne)

router.get("/check/:token", controller.checkInvite)
router.put("/accept/:token", controller.acceptInvite)
router.put("/reject/:token", controller.rejectInvite)
router.put("/resend/:token", auth(), controller.resendInvite)

module.exports = router
