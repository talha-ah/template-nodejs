const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const { CustomError } = require("./customError")

const ENV = process.env

module.exports = {
  // Generate a random string
  randomGenerator: (bytes = 32) => {
    return crypto.randomBytes(bytes).toString("hex").substr(0, bytes)
  },

  // Create a bcrypt hash
  hash: (data) => {
    return bcrypt.hashSync(data, Number(ENV.BCRYPT_SALT))
  },

  // Compare the bcrypt hash
  compareHash: (data, data2) => {
    return bcrypt.compareSync(data, data2)
  },

  // Create a JWT Token
  createJWT: (data) => {
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: 60 * 60 })
  },

  // Decode JWT Token
  useJWT: (data) => {
    try {
      return jwt.verify(data, process.env.JWT_SECRET)
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new CustomError("Token is expired", 401)
      } else if (error.name === "JsonWebTokenError") {
        throw new CustomError("Token is invalid", 401)
      } else if (error.name === "NotBeforeError") {
        throw new CustomError("Token is invalid", 401)
      } else {
        throw error
      }
    }
  },

  // Helper for console.log
  log: (value) => console.log(`${value}`, value),

  // Format a string (Make first letter of the string capital)
  formatMesaage: (str) => {
    if (typeof str !== "string") return ""

    // Make first letter capitial
    return str.charAt(0).toUpperCase() + str.slice(1)
  },

  // Generate base64
  toBase64: (data) => {
    return Buffer.from(data).toString("base64")
  },

  // Parse error
  parseError: (err) => {
    let name = err.name || ""
    let status = err.status || 500
    let message = err.message || ""

    if (err.isAxiosError) {
      // console.log("In Parse Error AXIOS".yellow, err)
      console.log(
        "In Parse Error AXIOS Headers".yellow,
        JSON.stringify(err.headers, null, 2)
      )
      console.log(
        "In Parse Error AXIOS Data".yellow,
        JSON.stringify(err.response.data, null, 2)
      )

      if (typeof err.response.data === "string") {
        message = err.response.data
      } else if (typeof err.response.data.message === "string") {
        message = err.response.data.message
      } else if (typeof err.response.data.error.message.value === "string") {
        message = err.response.data.error.message.value
      }

      status = err.response.status
    } else {
      console.log("In Parse Error".yellow, err)
    }

    console.log(`${name}: ${message}`.red)

    return { message, status, name }
  },

  // Call axios
  callAxios: async (config) => {
    const response = await axios(config)

    return response.data
  },

  formatDateTime: (date, format = "DD-MM-YYYY hh:mm A") => {
    if (!date) return ""

    return moment(date).format(format)
  },

  formatDate: (date, format = "DD-MM-YYYY") => {
    if (!date) return ""

    return moment(date).format(format)
  },

  formatTime: (date, format = "hh:mm A") => {
    if (!date) return ""

    return moment(date).format(format)
  },

  strToDate: (date, format = "DD-MM-YYYY") => {
    if (!date) return ""

    return moment(date, format).toDate()
  },

  formatTimeStampUnix: (date) => {
    if (!date) return ""

    return moment(date).valueOf()
  },

  checkBirthDate: (date, old = 18) => {
    if (!date) return false

    date = date * 1000

    let eighteenYearsDays = moment().diff(moment().add(-old, "years"), "days")
    let toNowDays = moment().diff(moment(date), "days")

    if (toNowDays < eighteenYearsDays) {
      throw new CustomError(errors.eighteenYearsOld, 406)
    }

    return true
  },
}
