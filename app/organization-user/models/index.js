const mongoose = require("mongoose")
const Schema = mongoose.Schema

const { STATUS } = require("../../../utils/constants")

const model = new Schema(
  {
    organizationId: {
      index: true,
      required: true,
      ref: "organization",
      type: Schema.Types.ObjectId,
    },
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
    status: {
      type: String,
      enum: STATUS,
      default: STATUS[0],
    },
  },
  { versionKey: false, timestamps: true }
)

module.exports = mongoose.model("organization-user", model)
