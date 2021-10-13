const mongoose = require("mongoose")

function connect() {
  return new Promise((resolve, reject) => {
    // Connecting to Database and listening to server
    mongoose
      .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      })
      .then(() => {
        resolve()
      })
      .catch((err) => {
        reject(err)
      })
  })
}

module.exports = connect
