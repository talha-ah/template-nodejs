const nodemailer = require("nodemailer");
const CustomError = require("./../utils/customError");

const ENV = process.env;

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: ENV.MAILER_HOST,
      port: ENV.MAILER_PORT,
      secure: ENV.SECURE,
      auth: {
        user: ENV.MAILER_USERNAME,
        pass: ENV.MAILER_PASSWORD,
      },
    });
  }

  async send(from, to, subject, content) {
    from = from || `${ENV.APP_NAME} <no-reply${ENV.MAILER_DOMAIN}>`;
    content = content || "Hello world";

    if (!to) throw new CustomError("Recipient is required");
    if (!subject) throw new CustomError("Subject is required");

    const sent = await this.transporter.sendMail({
      from,
      to: Array.isArray(to) ? to.join() : to,
      subject,
      text: content,
    });

    return;
  }
}

module.exports = MailService;
