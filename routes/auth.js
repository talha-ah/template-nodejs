const router = require("express").Router();

const upload = require("../middlewares/multer");
const authController = require("../controllers/auth");

router.post("/sign-up", upload("image"), authController.signup);
router.post("/sign-in", authController.signin);
router.post(
  "/request-email-verification",
  authController.RequestEmailVerification
);
router.post("/verify-email", authController.VerifyEmail);
router.post("/request-password-reset", authController.RequestPasswordReset);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
