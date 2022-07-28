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
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    image: {
      type: String,
    },
    fcmToken: {
      type: String,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    role: {
      trim: true,
      type: String,
      enum: ["user", "superadmin"],
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

module.exports = mongoose.model("user", model)
