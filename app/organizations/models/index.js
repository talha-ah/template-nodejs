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
    users: [
      {
        _id: false,
        userId: {
          index: true,
          ref: "user",
          required: true,
          type: Schema.Types.ObjectId,
        },
        role: {
          type: String,
          enum: ["admin", "user"],
          default: "user",
        },
        owner: {
          type: Boolean,
          default: false,
        },
        permissions: {
          type: Object,
        },
      },
    ],
    status: {
      type: String,
      enum: STATUS,
      default: STATUS[0],
    },
  },
  { versionKey: false, timestamps: true }
)

module.exports = mongoose.model("organization", model)
