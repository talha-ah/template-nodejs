const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const hpp = require("hpp")
const path = require("path")
const helmet = require("helmet")
const xss = require("xss-clean")
const mongoose = require("mongoose")

const mongoSanitize = require("express-mongo-sanitize")

module.exports = (app) => {
  mongoose.set("debug", true)
  app.options("*", cors())
  app.use(cors())
  app.use(morgan("dev"))
  app.use(mongoSanitize())
  app.use(helmet())
  app.use(xss())
  app.use(hpp())
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")))
  return app
}
