const mongoose = require("mongoose")
const Schema = mongoose.Schema

const model = new Schema(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "organization",
    },
  },
  { versionKey: false, timestamps: true }
)

module.exports = mongoose.model("organization-metadata", model)
