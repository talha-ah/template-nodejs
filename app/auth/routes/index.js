const router = require("express").Router()

const controller = require("../controllers")
const auth = require("../../../middlewares/auth")

router.get("/profile", auth(), controller.authProfile)
router.get("/organization/:orgId", auth(), controller.switchOrganization)

router.post("/login", controller.login)
router.post("/register", controller.register)
router.post("/refresh", controller.refreshToken)
router.post("/verify-email", controller.verifyEmailRequest)
router.put("/verify-email/:token", controller.verifyEmail)
router.post("/forgot-password", controller.forgotPassword)
router.put("/recover-password/:token", controller.recoverPassword)

router.get("/check/email/:email", controller.checkEmail)
router.get("/check/token/:token", controller.checkToken)

module.exports = router
