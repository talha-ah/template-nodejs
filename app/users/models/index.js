const mongoose = require("mongoose")
const Schema = mongoose.Schema

const { THEME, USER_STATUS, USER_ROLE } = require("../../../utils/constants")

const model = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      trim: true,
      index: true,
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    dob: {
      type: Date,
    },
    image: {
      type: String,
    },
    fcmToken: {
      type: String,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    theme: {
      trim: true,
      enum: THEME,
      type: String,
      default: THEME[0],
    },
    role: {
      trim: true,
      type: String,
      enum: USER_ROLE,
      default: USER_ROLE[0],
    },
    status: {
      type: String,
      enum: USER_STATUS,
      default: USER_STATUS[0],
    },
  },
  { versionKey: false, timestamps: true }
)

module.exports = mongoose.model("user", model)
