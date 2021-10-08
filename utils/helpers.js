const crypto = require("crypto")

module.exports = {
  randomGenerator: (bytes = 32) => {
    crypto.randomBytes(bytes).toString("hex")
  },
}
