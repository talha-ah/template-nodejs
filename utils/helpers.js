const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const ENV = process.env

module.exports = {
  // Generate a random string
  randomGenerator: (bytes = 32) => {
    return crypto.randomBytes(bytes).toString("hex")
  },

  // Create a bcrypt hash
  hash: (value) => {
    return bcrypt.hashSync(value, Number(ENV.BCRYPT_SALT))
  },

  // Compare the bcrypt hash
  compareHash: (value, value2) => {
    return bcrypt.compareSync(value, value2)
  },

  // Create a JWT Token
  sign: (value) => {
    return jwt.sign(value, ENV.JWT_SECRET)
  },

  // Decode JWT Token
  decode: (value) => {
    return jwt.decode(value, ENV.JWT_SECRET)
  },

  // Helper for console.log
  log: (value) => console.log(`${value}`, value),

  // Format a string (Make first letter of the string capital)
  formatMesaage: (str) => {
    if (!str) return ""

    // Make first letter capitial
    return str.charAt(0).toUpperCase() + str.slice(1)
  },
}
