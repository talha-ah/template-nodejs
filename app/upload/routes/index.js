const router = require("express").Router()

const controller = require("../controllers")
const auth = require("../../../middlewares/auth")
const upload = require("../../../middlewares/multer")

router.post("/", auth(), upload("images", "image"), controller.upload)

module.exports = router
