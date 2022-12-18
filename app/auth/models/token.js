const mongoose = require("mongoose")
const Schema = mongoose.Schema

const { TOKEN_TYPES } = require("../../../utils/constants")

const model = new Schema(
  {
    email: {
      index: true,
      type: String,
      required: true,
    },
    organizationId: {
      index: true,
      type: String,
    },
    type: {
      type: String,
      required: true,
      enum: TOKEN_TYPES,
      default: TOKEN_TYPES[0],
    },
  },
  { versionKey: false, timestamps: true }
)

module.exports = mongoose.model("token", model)
