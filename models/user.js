const Schema = require("mongoose").Schema

const userSchema = new Schema(
  {
    firstName: {
      trim: true,
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
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
      type: String,
      trim: true,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("user", userSchema)
