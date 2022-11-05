const nodemailer = require("nodemailer")

const { CustomError } = require("../utils/customError")

const ENV = process.env

class EMailService {
  constructor() {
    // this.transporter = nodemailer.createTransport({
    //   host: ENV.MAILER_HOST,
    //   port: ENV.MAILER_PORT,
    //   auth: {
    //     user: ENV.MAILER_USERNAME,
    //     pass: ENV.MAILER_PASSWORD,
    //   },
    // })

    this.transporter = nodemailer.createTransport({
      service: ENV.MAILER_SERVICE,
      auth: {
        user: ENV.MAILER_USERNAME,
        pass: ENV.MAILER_PASSWORD,
      },
    })
  }

  async send({ to, from, body, subject, messageId, attachments = [] }) {
    from = from || `${ENV.APP_NAME} <no-reply${ENV.APP_EMAIL}>`

    if (!body) throw new CustomError("Body is required")
    if (!to) throw new CustomError("Recipient is required")
    if (!subject) throw new CustomError("Subject is required")

    const mailOptions = {
      from,
      subject,
      messageId,
      html: body,
      attachments,
      to: Array.isArray(to) ? to.join(",") : to,
    }

    await this.transporter.sendMail(mailOptions)

    return
  }
}

module.exports = {
  emailService: new EMailService(),
}
