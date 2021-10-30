const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    first_name: {
      trim: true,
      type: String,
      required: true,
    },
    last_name: {
      trim: true,
      type: String,
    },
    email: {
      trim: true,
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    role: {
      trim: true,
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
    },
  },
  { versionKey: false, timestamps: true }
)

module.exports = mongoose.model("user", userSchema)
