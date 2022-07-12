const multer = require("multer")

const { checkDirectory } = require("../utils/helpers")
const { CustomError } = require("../utils/customError")

const uploader = (folder) => {
  return multer({
    storage: storage(folder),
    fileFilter: fileFilter([
      "image/png",
      "image/jpg",
      "image/jpeg",
      "application/pdf",
    ]),
  })
}

const storage = (folder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      if (req.body.path) {
        folder = `${folder.split("/")[0]}/${req.body.path}`
      }

      checkDirectory(folder)
      cb(null, folder)
    },
    filename: (req, file, cb) => {
      let name = Date.now() + "-" + file.originalname
      if (req.body.name) {
        name = `${req.body.name}.${file.originalname.split(".")[1]}`
      }

      cb(null, name)
    },
  })
}

const fileFilter = (filters) => (req, file, cb) => {
  if (filters.some((item) => item === file.mimetype)) {
    cb(null, true)
  } else {
    cb(new CustomError("Wrong extension type", 400), false)
  }
}

function addPathToBody(req, res, next) {
  if (req.files) {
    if (!Array.isArray(req.files)) {
      let files = {}
      Object.keys(req.files).map((key) => (files[key] = { files: [] }))
      for (var key in req.files) {
        req.files[key].map((file) =>
          files[key].files.push(
            file.path != undefined ? file.path.replace(/\\/g, "/") : null
          )
        )
        req.body["images"] = files
      }
    } else {
      let files = []
      req.files.map((file) => {
        files.push(
          file.path != undefined ? file.path.replace(/\\/g, "/") : null
        )
      })
      req.body["images"] = files
    }
  }
  if (req.file) req.body["image"] = req.file.path.replace(/\\/g, "/")
  next()
}

module.exports = (folder, field, type = "single") => {
  folder = `uploads/${folder}`
  return [
    type === "array"
      ? uploader(folder).array(field)
      : type === "fields"
      ? uploader(folder).fields(field)
      : uploader(folder).single(field),
    addPathToBody,
  ]
}
