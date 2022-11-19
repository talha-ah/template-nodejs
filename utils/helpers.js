const fs = require("fs")
const path = require("path")
const dayjs = require("dayjs")
const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { default: axios } = require("axios")

const { errors } = require("./texts")
const { CustomError } = require("./customError")

const ENV = process.env

module.exports = {
  // Generate a random string
  randomGenerator: (bytes = 32) => {
    return crypto.randomBytes(bytes).toString("hex").substr(0, bytes)
  },

  randomDate: (start, end) => {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    )
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

  clearFile: (filePath) => {
    filePath = path.join(__dirname, "..", filePath)
    fs.unlink(filePath, (err) => {
      if (err) {
        throw err
      }
    })
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
    return jwt.sign(data, ENV.JWT_SECRET, {
      expiresIn: isNaN(+ENV.JWT_EXPIRY) ? ENV.JWT_EXPIRY : +ENV.JWT_EXPIRY,
    })
  },

  // Decode JWT Token
  useJWT: (data) => {
    try {
      return jwt.verify(data, ENV.JWT_SECRET)
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

  // Decode JWT Token
  create4DigitToken: () => {
    return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1)
  },

  toTitleCase: (str) => {
    if (str) {
      str = str.charAt(0).toUpperCase() + str.slice(1)
    }
    return str
  },

  convertUnderscoreToWords: (str) => {
    str = str.split("_")
    str = str.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    return str.join(" ")
  },

  getName: (user) => {
    let name = user.firstName
    if (user.lastName) {
      name += " " + user.lastName
    }

    return name
  },

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
      if (typeof err.response.data === "string") {
        message = err.response.data
      } else if (typeof err.response.data.message === "string") {
        message = err.response.data.message
      } else if (
        err.response.data.message &&
        typeof err.response.data.error.message.value === "string"
      ) {
        message = err.response.data.error.message.value
      } else if (Array.isArray(err.response.data.errors)) {
        message = err.response.data.errors[0].message
      }

      status = err.response.status
      console.log(`Axios Error: ${name}: ${message}`)
    } else {
      console.log(`${name}: ${message}`)
    }

    return { message, status, name }
  },

  joiError: ({ error, value }) => {
    if (error) {
      const { details } = error
      const message = details.map((i) => i.message.replace(/"/g, "")).join(",")

      throw new CustomError(message, 405)
    }
    return value
  },

  // Call axios
  callAxios: async (config) => {
    const response = await axios(config)

    return response
  },

  formatDateTime: (date, format = "DD-MM-YYYY hh:mm A") => {
    if (!date) return ""

    return dayjs(date).format(format)
  },

  formatDate: (date, format = "DD-MM-YYYY") => {
    if (!date) return ""

    return dayjs(date).format(format)
  },

  formatTime: (date, format = "hh:mm A") => {
    if (!date) return ""

    return dayjs(date).format(format)
  },

  strToDate: (date, format = "DD-MM-YYYY") => {
    if (!date) return ""

    return dayjs(date, format).toDate()
  },

  formatTimeStampUnix: (date) => {
    if (!date) return ""

    return dayjs(date).valueOf()
  },

  checkBirthDate: (date, old = 18) => {
    if (!date) return false

    date = date * 1000

    let eighteenYearsDays = dayjs().diff(dayjs().add(-old, "years"), "days")
    let toNowDays = dayjs().diff(dayjs(date), "days")

    if (toNowDays < eighteenYearsDays) {
      throw new CustomError(errors.eighteenYearsOld, 406)
    }

    return true
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

  checkDirectory: (directory) => {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true })
    }
  },

  print: (path, layer) => {
    if (layer.route) {
      layer.route.stack.forEach(
        print.bind(null, path.concat(this.split(layer.route.path)))
      )
    } else if (layer.name === "router" && layer.handle.stack) {
      layer.handle.stack.forEach(
        print.bind(null, path.concat(this.split(layer.regexp)))
      )
    } else if (layer.method) {
      console.log(
        "%s /%s",
        layer.method.toUpperCase(),
        path.concat(this.split(layer.regexp)).filter(Boolean).join("/")
      )
    }
  },

  split: (thing) => {
    if (typeof thing === "string") {
      return thing.split("/")
    } else if (thing.fast_slash) {
      return ""
    } else {
      var match = thing
        .toString()
        .replace("\\/?", "")
        .replace("(?=\\/|$)", "$")
        .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
      return match
        ? match[1].replace(/\\(.)/g, "$1").split("/")
        : "<complex:" + thing.toString() + ">"
    }
  },

  printAppRoutes: (app) => {
    app._router.stack.forEach(this.print.bind(null, []))
  },
}
