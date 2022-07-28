const router = require("express").Router()

const controller = require("../controllers")

router.post("/login", controller.login)
router.post("/register", controller.register)
router.post("/verify-email/:email", controller.verifyEmailRequest)
router.put("/verify-email/:token", controller.verifyEmail)
router.post("/recover-password/:email", controller.recoverPasswordRequest)
router.put("/recover-password/:token", controller.recoverPassword)

router.get("/check/email/:email", controller.checkEmail)
router.get("/check/token/:token", controller.checkToken)

module.exports = router
