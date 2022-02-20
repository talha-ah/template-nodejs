const mongoose = require("mongoose")
const Schema = mongoose.Schema

const model = new Schema(
  {
    token: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: "verifyEmail",
      enum: ["resetPassword", "verifyEmail"],
    },
  },
  { versionKey: false, timestamps: true }
)

module.exports = mongoose.model("token", model)
