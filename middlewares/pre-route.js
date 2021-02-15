const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const hpp = require("hpp");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoose = require("mongoose");
const compression = require('compression');
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});

module.exports = (app) => {
  mongoose.set("debug", true);
  app.options("*", cors());
  app.use(cors());
  app.use(morgan("dev"));
  app.use(mongoSanitize());
  app.use(helmet());
  app.use(xss());
  app.use(hpp());
  app.use(compression());
  app.use(express.json());
  app.use(limiter);
  app.use(express.static("/public"));
  app.use(express.urlencoded({ extended: false }));
  app.use("/uploads", express.static("/uploads"));

  return app;
};
