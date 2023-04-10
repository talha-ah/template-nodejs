const mongoose = require("mongoose")
const Schema = mongoose.Schema

const { STATUS } = require("../../../utils/constants")

const model = new Schema(
  {
    name: {
      trim: true,
      type: String,
      required: true,
    },
    email: {
      trim: true,
      type: String,
    },
    phone: {
      type: String,
    },
    logo: {
      type: String,
    },
    address: {
      addressOne: {
        type: String,
      },
      addressTwo: {
        type: String,
      },
      addressThree: {
        type: String,
      },
      zip: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
    },
    status: {
      type: String,
      enum: STATUS,
      default: STATUS[0],
    },
  },
  { versionKey: false, timestamps: true }
)

module.exports = mongoose.model("organization", model)
