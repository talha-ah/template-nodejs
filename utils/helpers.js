const fs = require("fs")
const dayjs = require("dayjs")
const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { default: axios } = require("axios")

const { CustomError } = require("./customError")

const ENV = process.env

module.exports = {
  // Generate a random string
  randomGenerator: (bytes = 32) => {
    return crypto.randomBytes(bytes).toString("hex").substr(0, bytes)
  },

  generateId: (prefix = "", length = 7) => {
    let result = prefix
    for (let i = 0; i < length; i++) {
      const random = Math.random()
      result += String.fromCharCode(
        Math.floor(random * 26) + (random < 0.5 ? 65 : 97)
      )
    }
    return result
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
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: ENV.JWT_EXPIRY })
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

  create4DigitToken: () => {
    return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1)
  },

  titleCase: (str) => {
    if (str) {
      str = str.split("")
      str[0] = str[0].toUpperCase()
      str = str.join("")
    }
    return str
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
    let data = err.data
    let name = err.name || ""
    let status = err.status || 500
    let message = err.message || ""

    if (err.isAxiosError) {
      // console.log("In Parse Error AXIOS".yellow, err)
      console.log("Headers".red, JSON.stringify(err.headers, null, 2))
      console.log("Data".red, JSON.stringify(err.response.data, null, 2))

      if (typeof err.response.data === "string") {
        message = err.response.data
      } else if (typeof err.response.data.message === "string") {
        message = err.response.data.message
      } else if (typeof err.response.data.error.message.value === "string") {
        message = err.response.data.error.message.value
      }

      status = err.response.status
    }

    console.log(message.red)

    return { message, status, name, data }
  },

  // Call axios
  callAxios: async (config) => {
    const response = await axios(config)

    return { response: response.data, headers: response.headers }
  },

  formatDateTime: (date, format = "DD-MM-YYYY hh:mm A") => {
    if (!date) return ""

    return dayjs(date).format(format)
  },

  formatDate: (date, format = "MM-DD-YYYY") => {
    if (!date) return ""

    return dayjs(date).format(format)
  },

  formatTime: (date, format = "hh:mm A") => {
    if (!date) return ""

    return dayjs(date).format(format)
  },

  strToDate: (date, format = "MM-DD-YYYY") => {
    if (!date) return ""

    return dayjs(date, format).toDate()
  },

  formatTimeStampUnix: (date) => {
    if (!date) return ""

    return dayjs(date).valueOf()
  },

  checkDateOfBirth: (date, old = 18) => {
    if (!date) return false

    date = date * 1000

    let eighteenYearsDays = dayjs().subtract(old, "year")
    let toNowDays = dayjs(date)

    if (toNowDays.isAfter(eighteenYearsDays)) {
      return null
    }

    return date
  },

  checkDirectory: (directory) => {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }
  },

  joiError: ({ error, value }) => {
    if (error) {
      const { details } = error
      const data = {}
      const message = details
        .map((i) => {
          i.message = i.message.replace(/['"]/g, "")
          data[i.context.key] = i.message
          return i.message
        })
        .join(",")

      throw new CustomError(message, 405, data)
    }
    return value
  },

  batchPromises: async (promises, batchSize = 10, fn, pauseProcess) => {
    let batches = []
    let totalPromises = promises.length

    for (let i = 0; i < totalPromises; i += batchSize) {
      batches.push(promises.slice(i, i + batchSize))
    }

    for (let batch of batches) {
      let batchedPromises = []
      let batchLength = batch.length

      for (let i = 0; i < batchLength; i++) {
        batchedPromises.push(fn(batch[i]))
      }

      await Promise.all(batchedPromises)

      pauseProcess && (await pauseProcess()) // pause the process for 30 seconds
    }

    return
  },

  pauseProcess: (timer = 60) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, timer * 1000)
    })
  },
}
