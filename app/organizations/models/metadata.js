const mongoose = require("mongoose")
const Schema = mongoose.Schema

const model = new Schema(
  {
    organizationId: {
      index: true,
      required: true,
      ref: "organization",
      type: Schema.Types.ObjectId,
    },
  },
  { versionKey: false, timestamps: true }
)

module.exports = mongoose.model("organization-metadata", model)
