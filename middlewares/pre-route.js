const hpp = require("hpp")
const cors = require("cors")
const path = require("path")
const morgan = require("morgan")
const helmet = require("helmet")
const xss = require("xss-clean")
const express = require("express")
const mongoose = require("mongoose")
const mongoSanitize = require("express-mongo-sanitize")

module.exports = (app) => {
  if (process.env.NODE_ENV === "development") {
    // mongoose.set("debug", true)
    app.use(morgan("dev"))
  } else {
    app.use(morgan("combined"))
  }

  app.options("*", cors())
  app.use(cors())
  app.use(mongoSanitize())
  app.use(helmet())
  app.use(xss())
  app.use(hpp())
  app.use(express.json()) // for parsing application/json
  app.use(express.urlencoded({ extended: false })) // for parsing application/x-www-form-urlencoded (Note: multer is used for parsing multipart/form-data)
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")))
  return app
}
