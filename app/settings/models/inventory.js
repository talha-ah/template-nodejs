// const mongoose = require("mongoose")
// const Schema = mongoose.Schema

// const Model = new Schema(
//   {
//     organizationId: {
//       index: true,
//       required: true,
//       ref: "organization",
//       type: Schema.Types.ObjectId,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       trim: true,
//       type: String,
//       default: "",
//     },
//     phone: {
//       type: String,
//       default: "",
//     },
//     address: {
//       addressOne: {
//         type: String,
//         default: "",
//       },
//       addressTwo: {
//         type: String,
//       },
//       addressThree: {
//         type: String,
//       },
//       zip: {
//         type: String,
//       },
//       city: {
//         type: String,
//       },
//       state: {
//         type: String,
//       },
//       country: {
//         type: String,
//       },
//     },
//   },
//   { versionKey: false, timestamps: true }
// )

// module.exports = mongoose.model("settings-inventory", Model)
