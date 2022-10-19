const mongoose = require("mongoose")
const Schema = mongoose.Schema

const model = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    organizationId: {
      type: String,
    },
    type: {
      type: String,
      required: true,
      default: "refresh-token",
      enum: ["refresh-token", "recover-password", "verify-email"],
    },
  },
  { versionKey: false, timestamps: true }
)

module.exports = mongoose.model("token", model)
