const mongoose = require("mongoose")
const Schema = mongoose.Schema

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
      type: String,
      unique: true,
      required: true,
    },
    organizationId: {
      index: true,
      required: true,
      ref: "organization",
      type: mongoose.Types.ObjectId,
    },
  },
  { versionKey: false, timestamps: true }
)

module.exports = mongoose.model("invite", model)
